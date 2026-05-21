import { pool } from '../../config/database.js';

const resolveAirportCode = async (input) => {
  if (!input) return null;

  const trimmed = input.trim();
  if (!trimmed) return null;

  const codeCandidate = trimmed.toUpperCase();
  const like = `%${trimmed}%`;

  const [rows] = await pool.query(
    `SELECT code
     FROM airports
     WHERE code = ? OR city LIKE ? OR airport_name LIKE ? OR country LIKE ?
     ORDER BY
       CASE
         WHEN code = ? THEN 1
         WHEN city LIKE ? THEN 2
         WHEN airport_name LIKE ? THEN 3
         WHEN country LIKE ? THEN 4
         ELSE 5
       END,
       popularity DESC
     LIMIT 1`,
    [codeCandidate, like, like, like, codeCandidate, like, like, like]
  );

  return rows[0]?.code || null;
};

export const searchAirportsService = async (query, limit = 10) => {
  const like = `%${query}%`;

  const [rows] = await pool.query(
    `SELECT
       code,
       city,
       country,
       airport_name,
       state,
       city_group,
       popularity
     FROM airports
     WHERE code LIKE ? OR city LIKE ? OR airport_name LIKE ? OR country LIKE ?
     ORDER BY
       CASE
         WHEN code LIKE ? THEN 1
         WHEN city LIKE ? THEN 2
         WHEN airport_name LIKE ? THEN 3
         WHEN country LIKE ? THEN 4
         ELSE 5
       END,
       popularity DESC,
       city ASC
     LIMIT ?`,
    [like, like, like, like, like, like, like, like, Number(limit)]
  );

  return rows;
};

export const getPopularAirportsService = async (limit = 8) => {
  const [rows] = await pool.query(
    `SELECT
       code,
       city,
       country,
       airport_name,
       state,
       city_group,
       popularity
     FROM airports
     ORDER BY popularity DESC, city ASC
     LIMIT ?`,
    [Number(limit)]
  );

  return rows;
};

export const getRecentSearchesService = async (limit = 6) => {
  const [rows] = await pool.query(
    `SELECT
       rs.id,
       rs.from_airport,
       rs.to_airport,
       rs.searched_at,
       af.city AS from_city,
       af.country AS from_country,
       af.airport_name AS from_airport_name,
       at.city AS to_city,
       at.country AS to_country,
       at.airport_name AS to_airport_name
     FROM recent_searches rs
     JOIN airports af ON af.code = rs.from_airport
     JOIN airports at ON at.code = rs.to_airport
     ORDER BY rs.searched_at DESC
     LIMIT ?`,
    [Number(limit)]
  );

  return rows;
};

export const saveRecentSearchService = async (fromAirport, toAirport) => {
  const fromCode = await resolveAirportCode(fromAirport);
  const toCode = await resolveAirportCode(toAirport);

  if (!fromCode || !toCode) {
    return { saved: false };
  }

  const [result] = await pool.query(
    'INSERT INTO recent_searches (from_airport, to_airport, searched_at) VALUES (?, ?, NOW())',
    [fromCode, toCode]
  );

  return { saved: true, id: result.insertId };
};

const buildFlightsQuery = (filters) => {
  const conditions = [
    'f.from_airport = ?',
    'f.to_airport = ?'
  ];
  const params = [filters.fromCode, filters.toCode];

  if (filters.date) {
    conditions.push('f.`date` = ?');
    params.push(filters.date);
  }

  if (filters.cabinClass) {
    conditions.push('f.cabin_class = ?');
    params.push(filters.cabinClass);
  }

  if (filters.stops !== undefined && filters.stops !== null && filters.stops !== '') {
    const stopValue = Number(filters.stops);
    if (!Number.isNaN(stopValue)) {
      conditions.push('f.stops = ?');
      params.push(stopValue);
    }
  }

  if (filters.refundable === true) {
    conditions.push('f.refundable = 1');
  }

  if (filters.minPrice) {
    conditions.push('f.price >= ?');
    params.push(Number(filters.minPrice));
  }

  if (filters.maxPrice) {
    conditions.push('f.price <= ?');
    params.push(Number(filters.maxPrice));
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  return {
    sql: `SELECT
            f.id,
            f.airline_id,
            a.airline_name,
            a.airline_code,
            a.logo,
            f.flight_number,
            f.from_airport,
            f.to_airport,
            f.departure_time,
            f.arrival_time,
            f.duration,
            f.price,
            f.stops,
            f.cabin_class,
            f.refundable,
            f.seats_left,
            f.trip_type,
          f.date AS flight_date,
            af.city AS from_city,
            af.country AS from_country,
            af.airport_name AS from_airport_name,
            at.city AS to_city,
            at.country AS to_country,
            at.airport_name AS to_airport_name
          FROM flights f
          JOIN airlines a ON a.id = f.airline_id
          JOIN airports af ON af.code = f.from_airport
          JOIN airports at ON at.code = f.to_airport
          ${whereClause}
          ORDER BY f.price ASC`,
    params
  };
};

const attachSegmentsAndFares = async (flights) => {
  if (!flights.length) return [];

  const flightIds = flights.map((flight) => flight.id);

  const [segments] = await pool.query(
    `SELECT
       s.flight_id,
       s.segment_order,
       s.from_airport,
       s.to_airport,
       s.departure_time,
       s.arrival_time,
       s.duration,
       s.layover_time,
       s.aircraft,
       s.terminal,
       af.city AS from_city,
       af.country AS from_country,
       af.airport_name AS from_airport_name,
       at.city AS to_city,
       at.country AS to_country,
       at.airport_name AS to_airport_name
     FROM flight_segments s
     JOIN airports af ON af.code = s.from_airport
     JOIN airports at ON at.code = s.to_airport
     WHERE s.flight_id IN (?)
     ORDER BY s.flight_id, s.segment_order`,
    [flightIds]
  );

  const [fares] = await pool.query(
    `SELECT
       flight_id,
       fare_name,
       price,
       refundable,
       free_meals,
       free_seats,
       cancellation_fee,
       date_change_fee,
       refund_type,
       refund_amount
     FROM fare_options
     WHERE flight_id IN (?)
     ORDER BY flight_id, price ASC`,
    [flightIds]
  );

  const segmentsByFlight = segments.reduce((acc, segment) => {
    if (!acc[segment.flight_id]) {
      acc[segment.flight_id] = [];
    }
    acc[segment.flight_id].push(segment);
    return acc;
  }, {});

  const faresByFlight = fares.reduce((acc, fare) => {
    if (!acc[fare.flight_id]) {
      acc[fare.flight_id] = [];
    }
    acc[fare.flight_id].push(fare);
    return acc;
  }, {});

  return flights.map((flight) => ({
    ...flight,
    segments: segmentsByFlight[flight.id] || [],
    fare_options: faresByFlight[flight.id] || []
  }));
};

const seedHash = (value) => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) % 100000;
  }
  return hash;
};

const timeToMinutes = (timeValue) => {
  if (!timeValue) return 0;
  const [hours, minutes] = String(timeValue).split(':').map(Number);
  return (hours || 0) * 60 + (minutes || 0);
};

const minutesToTime = (totalMinutes) => {
  const normalized = ((totalMinutes % 1440) + 1440) % 1440;
  const hours = Math.floor(normalized / 60);
  const minutes = normalized % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;
};

const addMinutesToTime = (timeValue, minutesToAdd) =>
  minutesToTime(timeToMinutes(timeValue) + Number(minutesToAdd || 0));

const ensureRouteFlights = async ({ fromCode, toCode, date }) => {
  if (!date || !fromCode || !toCode || fromCode === toCode) {
    return;
  }

  const [[fromAirport]] = await pool.query(
    'SELECT code, city, country, airport_name FROM airports WHERE code = ? LIMIT 1',
    [fromCode]
  );
  const [[toAirport]] = await pool.query(
    'SELECT code, city, country, airport_name FROM airports WHERE code = ? LIMIT 1',
    [toCode]
  );

  if (!fromAirport || !toAirport) {
    return;
  }

  const [airlines] = await pool.query(
    'SELECT id, airline_name, airline_code, logo FROM airlines ORDER BY id ASC'
  );

  if (!airlines.length) {
    return;
  }

  const [hubRows] = await pool.query(
    'SELECT code FROM airports WHERE code NOT IN (?, ?) ORDER BY popularity DESC LIMIT 12',
    [fromCode, toCode]
  );
  const hubs = hubRows.map((row) => row.code);

  const seedBase = seedHash(`${fromCode}-${toCode}-${date}`);
  const isDomestic = fromAirport.country === toAirport.country;
  const flightsCount = 3 + (seedBase % 3);
  const timeSlots = ['06:10:00', '09:25:00', '12:40:00', '15:55:00', '19:10:00', '22:25:00'];

  const clampStops = (stopCount) => (hubs.length ? Math.min(stopCount, hubs.length) : 0);

  const buildSegmentDurations = (airDurationValue, segmentCount, seed) => {
    const minSegment = 50;
    const airMinutes = Number(airDurationValue) || 0;
    const baseTotal = minSegment * segmentCount;
    const remaining = Math.max(0, airMinutes - baseTotal);
    const durations = Array.from({ length: segmentCount }, () => minSegment);

    if (remaining > 0) {
      const evenShare = Math.floor(remaining / segmentCount);
      for (let index = 0; index < segmentCount; index += 1) {
        durations[index] += evenShare;
      }

      let remainder = remaining - evenShare * segmentCount;
      for (let index = 0; index < remainder; index += 1) {
        durations[(seed + index) % segmentCount] += 1;
      }
    }

    return durations;
  };

  const buildLayovers = (stopCount, seed) =>
    Array.from({ length: stopCount }, (_, index) => 60 + ((seed + index * 13) % 61));

  const buildPlan = (airDurationValue, stopCount, seed) => {
    const segmentCount = stopCount + 1;
    const segmentDurations = buildSegmentDurations(airDurationValue, segmentCount, seed);
    const layovers = stopCount > 0 ? buildLayovers(stopCount, seed + 19) : [];
    const totalDuration = segmentDurations.reduce((sum, value) => sum + Number(value || 0), 0)
      + layovers.reduce((sum, value) => sum + Number(value || 0), 0);

    return { segmentDurations, layovers, totalDuration };
  };

  const pickHubs = (stopCount, seedOffset) => {
    if (stopCount <= 0 || !hubs.length) return [];
    const hubStart = (seedBase + seedOffset) % hubs.length;
    return Array.from({ length: stopCount }, (_, index) => hubs[(hubStart + index) % hubs.length]);
  };

  const buildSegmentRows = ({
    flightId,
    departureTime,
    segmentDurations,
    layovers,
    hubCodes,
    terminal,
    aircraft
  }) => {
    const rows = [];
    let currentFrom = fromCode;
    let currentDeparture = departureTime;

    for (let index = 0; index < segmentDurations.length; index += 1) {
      const isLast = index === segmentDurations.length - 1;
      const toAirport = isLast ? toCode : hubCodes[index];
      const segmentDuration = segmentDurations[index];
      const arrivalTime = addMinutesToTime(currentDeparture, segmentDuration);
      const layover = !isLast ? (layovers[index] ?? 60) : null;

      rows.push([
        flightId,
        index + 1,
        currentFrom,
        toAirport,
        currentDeparture,
        arrivalTime,
        segmentDuration,
        layover,
        aircraft,
        terminal
      ]);

      currentFrom = toAirport;
      if (!isLast) {
        currentDeparture = addMinutesToTime(arrivalTime, layover);
      }
    }

    return rows;
  };

  const [existingFlights] = await pool.query(
    'SELECT id, departure_time, duration, stops FROM flights WHERE from_airport = ? AND to_airport = ? AND `date` = ?',
    [fromCode, toCode, date]
  );

  if (existingFlights.length) {
    const maxStops = existingFlights.reduce(
      (maxValue, flight) => Math.max(maxValue, Number(flight.stops) || 0),
      0
    );
    const shouldForceMultiStop = !isDomestic && hubs.length >= 2 && seedBase % 2 === 0;
    const desiredMultiStops = shouldForceMultiStop
      ? clampStops(hubs.length >= 3 && seedBase % 3 === 0 ? 3 : 2)
      : 0;
    let targetStops = 0;

    if (desiredMultiStops > maxStops) {
      targetStops = desiredMultiStops;
    } else if (maxStops === 0 && hubs.length > 0) {
      targetStops = 1;
    }

    if (targetStops > 0) {
      const candidates = existingFlights.filter((flight) => Number(flight.stops) < targetStops);
      const targetFlight = candidates.length
        ? candidates[seedBase % candidates.length]
        : existingFlights[seedBase % existingFlights.length];
      const [existingSegments] = await pool.query(
        'SELECT duration FROM flight_segments WHERE flight_id = ? ORDER BY segment_order',
        [targetFlight.id]
      );
      const airDuration = existingSegments.length
        ? existingSegments.reduce((sum, segment) => sum + Number(segment.duration || 0), 0)
        : Number(targetFlight.duration) || 0;
      const adjustedStops = clampStops(targetStops);

      if (airDuration > 0 && adjustedStops > 0) {
        const plan = buildPlan(airDuration, adjustedStops, seedBase + targetFlight.id);
        const arrivalTime = addMinutesToTime(targetFlight.departure_time, plan.totalDuration);
        const hubCodes = pickHubs(adjustedStops, targetFlight.id);
        const terminal = (seedBase + targetFlight.id) % 2 === 0 ? 'T1' : 'T2';
        const aircraft = isDomestic ? 'Airbus A320' : 'Boeing 777';
        const segmentRows = buildSegmentRows({
          flightId: targetFlight.id,
          departureTime: targetFlight.departure_time,
          segmentDurations: plan.segmentDurations,
          layovers: plan.layovers,
          hubCodes,
          terminal,
          aircraft
        });

        if (segmentRows.length) {
          await pool.query(
            'UPDATE flights SET stops = ?, duration = ?, arrival_time = ? WHERE id = ?',
            [adjustedStops, plan.totalDuration, arrivalTime, targetFlight.id]
          );
          await pool.query('DELETE FROM flight_segments WHERE flight_id = ?', [targetFlight.id]);
          await pool.query(
            `INSERT INTO flight_segments
             (flight_id, segment_order, from_airport, to_airport, departure_time, arrival_time, duration, layover_time, aircraft, terminal)
             VALUES ?`,
            [segmentRows]
          );
        }
      }
    }

    return;
  }

  const flightValues = [];
  const flightMeta = [];

  for (let i = 0; i < flightsCount; i += 1) {
    const airline = airlines[(seedBase + i) % airlines.length];
    const departureTime = timeSlots[(seedBase + i) % timeSlots.length];
    let stops = 0;
    if (!isDomestic && hubs.length > 0) {
      const stopSeed = (seedBase + i * 7) % 10;
      if (stopSeed === 0 && hubs.length >= 3) {
        stops = 3;
      } else if (stopSeed <= 2 && hubs.length >= 2) {
        stops = 2;
      } else if (stopSeed <= 5) {
        stops = 1;
      }
    } else {
      const stopModulo = isDomestic ? 4 : 3;
      stops = ((seedBase + i) % stopModulo === 0 && hubs.length > 0) ? 1 : 0;
    }

    stops = clampStops(stops);
    const airDuration = isDomestic
      ? 90 + ((seedBase + i * 17) % 120)
      : 360 + ((seedBase + i * 29) % 540);
    const plan = buildPlan(airDuration, stops, seedBase + i * 13);
    const totalDuration = plan.totalDuration;
    const arrivalTime = addMinutesToTime(departureTime, totalDuration);
    const basePrice = isDomestic
      ? 3500 + ((seedBase + i * 53) % 4000)
      : 18000 + ((seedBase + i * 91) % 42000);
    const seatsLeft = 6 + ((seedBase + i * 11) % 24);
    const refundable = (seedBase + i) % 2 === 0 ? 1 : 0;
    const flightNumber = `${airline.airline_code}${100 + ((seedBase + i * 7) % 900)}`;

    flightValues.push([
      airline.id,
      flightNumber,
      fromCode,
      toCode,
      departureTime,
      arrivalTime,
      totalDuration,
      basePrice,
      stops,
      'Economy',
      refundable,
      seatsLeft,
      'oneway',
      date,
      fromAirport.city,
      toAirport.city
    ]);

    flightMeta.push({
      departureTime,
      duration: totalDuration,
      airDuration,
      stops,
      basePrice,
      refundable,
      segmentDurations: plan.segmentDurations,
      layovers: plan.layovers
    });
  }

  const hasStopFlight = flightMeta.some((flight) => flight.stops > 0);
  const hasMultiStopFlight = flightMeta.some((flight) => flight.stops >= 2);
  const shouldForceMultiStop = !isDomestic && hubs.length >= 2 && seedBase % 2 === 0;

  if (shouldForceMultiStop && !hasMultiStopFlight && flightMeta.length) {
    const forcedIndex = seedBase % flightMeta.length;
    const forcedMeta = flightMeta[forcedIndex];
    const forcedStops = clampStops(hubs.length >= 3 && seedBase % 3 === 0 ? 3 : 2);
    const airDuration = forcedMeta.airDuration || 0;

    if (airDuration > 0 && forcedStops > 0) {
      const plan = buildPlan(airDuration, forcedStops, seedBase + forcedIndex * 17);
      const arrivalTime = addMinutesToTime(forcedMeta.departureTime, plan.totalDuration);

      forcedMeta.stops = forcedStops;
      forcedMeta.duration = plan.totalDuration;
      forcedMeta.segmentDurations = plan.segmentDurations;
      forcedMeta.layovers = plan.layovers;

      flightValues[forcedIndex][5] = arrivalTime;
      flightValues[forcedIndex][6] = plan.totalDuration;
      flightValues[forcedIndex][8] = forcedStops;
    }
  } else if (!hasStopFlight && hubs.length > 0 && flightMeta.length) {
    const forcedIndex = seedBase % flightMeta.length;
    const forcedMeta = flightMeta[forcedIndex];
    const airDuration = forcedMeta.airDuration || 0;

    if (airDuration > 0) {
      const plan = buildPlan(airDuration, 1, seedBase + forcedIndex * 17);
      const arrivalTime = addMinutesToTime(forcedMeta.departureTime, plan.totalDuration);

      forcedMeta.stops = 1;
      forcedMeta.duration = plan.totalDuration;
      forcedMeta.segmentDurations = plan.segmentDurations;
      forcedMeta.layovers = plan.layovers;

      flightValues[forcedIndex][5] = arrivalTime;
      flightValues[forcedIndex][6] = plan.totalDuration;
      flightValues[forcedIndex][8] = 1;
    }
  }

  const [insertResult] = await pool.query(
    `INSERT INTO flights
     (airline_id, flight_number, from_airport, to_airport, departure_time, arrival_time, duration, price, stops, cabin_class, refundable, seats_left, trip_type, \`date\`, from_city, to_city)
     VALUES ?`,
    [flightValues]
  );

  const firstId = insertResult.insertId;
  const segmentRows = [];
  const fareRows = [];

  for (let i = 0; i < flightsCount; i += 1) {
    const flightId = firstId + i;
    const meta = flightMeta[i];
    const terminal = (seedBase + i) % 2 === 0 ? 'T1' : 'T2';
    const aircraft = isDomestic ? 'Airbus A320' : 'Boeing 777';

    if (meta.stops === 0 || hubs.length === 0) {
      segmentRows.push([
        flightId,
        1,
        fromCode,
        toCode,
        meta.departureTime,
        addMinutesToTime(meta.departureTime, meta.duration),
        meta.duration,
        null,
        aircraft,
        terminal
      ]);
    } else {
      const hubCodes = pickHubs(meta.stops, i);
      const plan = meta.segmentDurations?.length
        ? { segmentDurations: meta.segmentDurations, layovers: meta.layovers || [] }
        : buildPlan(meta.airDuration || meta.duration, meta.stops, seedBase + i * 13);
      const segmentRowsForFlight = buildSegmentRows({
        flightId,
        departureTime: meta.departureTime,
        segmentDurations: plan.segmentDurations,
        layovers: plan.layovers,
        hubCodes,
        terminal,
        aircraft
      });

      segmentRows.push(...segmentRowsForFlight);
    }

    fareRows.push([
      flightId,
      'Saver',
      meta.basePrice,
      meta.refundable,
      0,
      0,
      3500,
      2500,
      meta.refundable ? 'partial' : 'non-refundable',
      meta.refundable ? Math.round(meta.basePrice * 0.6) : 0
    ]);
    fareRows.push([
      flightId,
      'Flexi',
      meta.basePrice + 1200,
      1,
      1,
      1,
      1500,
      800,
      'partial',
      Math.round((meta.basePrice + 1200) * 0.75)
    ]);
    fareRows.push([
      flightId,
      'Premium',
      meta.basePrice + 2500,
      1,
      1,
      1,
      500,
      300,
      'full',
      Math.round((meta.basePrice + 2500) * 0.9)
    ]);
  }

  if (segmentRows.length) {
    await pool.query(
      `INSERT INTO flight_segments
       (flight_id, segment_order, from_airport, to_airport, departure_time, arrival_time, duration, layover_time, aircraft, terminal)
       VALUES ?`,
      [segmentRows]
    );
  }

  if (fareRows.length) {
    await pool.query(
      `INSERT INTO fare_options
       (flight_id, fare_name, price, refundable, free_meals, free_seats, cancellation_fee, date_change_fee, refund_type, refund_amount)
       VALUES ?`,
      [fareRows]
    );
  }
};

const normalizeDateParam = (value) => {
  if (!value) return null;
  const raw = String(value).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;

  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return null;

  const year = parsed.getUTCFullYear();
  const month = String(parsed.getUTCMonth() + 1).padStart(2, '0');
  const day = String(parsed.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const applyDatePricing = (flights, travelDate) => {
  if (!travelDate) return flights;

  const parsed = new Date(travelDate);
  if (Number.isNaN(parsed.getTime())) return flights;

  const daySeed = parsed.getUTCDate();
  const monthSeed = parsed.getUTCMonth() + 1;
  const dateFactor = (daySeed + monthSeed) % 5;

  return flights.map((flight) => {
    const basePrice = Number(flight.price) || 0;
    const idFactor = Number(flight.id) % 4;
    const adjustedPrice = Math.max(500, basePrice + (dateFactor * 180) + (idFactor * 90));

    const fareOptions = (flight.fare_options || []).map((fare) => {
      const fareName = String(fare.fare_name || '').toLowerCase();
      const fareDelta = fareName.includes('premium')
        ? 2500
        : fareName.includes('flexi')
          ? 1200
          : 0;
      const updatedPrice = adjustedPrice + fareDelta;
      const refundable = Number(fare.refundable) === 1;
      const refundRate = fareName.includes('premium')
        ? 0.9
        : fareName.includes('flexi')
          ? 0.75
          : 0.6;

      return {
        ...fare,
        price: updatedPrice,
        refund_amount: refundable ? Math.round(updatedPrice * refundRate) : 0
      };
    });

    return {
      ...flight,
      price: adjustedPrice,
      fare_options: fareOptions
    };
  });
};

export const searchFlightsService = async ({
  from,
  to,
  tripType,
  cabinClass,
  stops,
  refundable,
  minPrice,
  maxPrice,
  date,
  returnDate
}) => {
  const fromCode = await resolveAirportCode(from);
  const toCode = await resolveAirportCode(to);

  const outboundDate = normalizeDateParam(date);
  const inboundDate = normalizeDateParam(returnDate || date);

  if (!fromCode || !toCode) {
    return { flights: [], outbound: [], return: [] };
  }

  const baseFilters = {
    fromCode,
    toCode,
    cabinClass,
    stops,
    refundable: String(refundable).toLowerCase() === 'true',
    minPrice,
    maxPrice,
    date: outboundDate
  };

  if (outboundDate) {
    await ensureRouteFlights({ fromCode, toCode, date: outboundDate });
  }

  const outboundQuery = buildFlightsQuery(baseFilters);
  const [outboundRows] = await pool.query(outboundQuery.sql, outboundQuery.params);
  const outboundFlights = applyDatePricing(
    await attachSegmentsAndFares(outboundRows),
    outboundDate
  );

  if (tripType && tripType.toLowerCase() === 'roundtrip') {
    const returnQuery = buildFlightsQuery({
      ...baseFilters,
      fromCode: toCode,
      toCode: fromCode,
      date: inboundDate
    });

    if (inboundDate) {
      await ensureRouteFlights({ fromCode: toCode, toCode: fromCode, date: inboundDate });
    }
    const [returnRows] = await pool.query(returnQuery.sql, returnQuery.params);
    const returnFlights = applyDatePricing(
      await attachSegmentsAndFares(returnRows),
      inboundDate
    );

    return {
      outbound: outboundFlights,
      return: returnFlights
    };
  }

  return { flights: outboundFlights };
};

export const createBookingService = async ({
  tripType,
  departureFlightId,
  returnFlightId,
  email,
  phone,
  totalPrice,
  passengers
}) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    try {
      const [bookingResult] = await connection.query(
        `INSERT INTO bookings
         (trip_type, departure_flight_id, return_flight_id, email, phone, total_price, booking_status, created_at)
         VALUES (?, ?, ?, ?, ?, ?, 'confirmed', NOW())`,
        [tripType, departureFlightId, returnFlightId, email, phone, totalPrice]
      );

      const bookingId = bookingResult.insertId;

      if (passengers.length) {
        const passengerRows = passengers.map((traveller) => [
          bookingId,
          traveller.firstName,
          traveller.lastName || null,
          traveller.gender || null,
          traveller.age || null
        ]);

        await connection.query(
          `INSERT INTO passengers
           (booking_id, first_name, last_name, gender, age)
           VALUES ?`,
          [passengerRows]
        );
      }

      await connection.commit();
      return bookingId;
    } catch (error) {
      await connection.rollback();

      if (error.code !== 'ER_BAD_FIELD_ERROR') {
        throw error;
      }

      await connection.beginTransaction();

      const legacyPayload = JSON.stringify({
        tripType,
        departureFlightId,
        returnFlightId,
        contact: { email, phone },
        passengers
      });

      const [bookingResult] = await connection.query(
        `INSERT INTO bookings
         (user_id, type, reference_id, passengers, total_price, status, created_at, updated_at)
         VALUES (?, 'flight', ?, ?, ?, 'confirmed', NOW(), NOW())`,
        [null, departureFlightId, legacyPayload, totalPrice]
      );

      const bookingId = bookingResult.insertId;

      if (passengers.length) {
        const passengerRows = passengers.map((traveller) => [
          bookingId,
          traveller.firstName,
          traveller.lastName || null,
          traveller.gender || null,
          traveller.age || null
        ]);

        await connection.query(
          `INSERT INTO passengers
           (booking_id, first_name, last_name, gender, age)
           VALUES ?`,
          [passengerRows]
        );
      }

      await connection.commit();
      return bookingId;
    }
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};
