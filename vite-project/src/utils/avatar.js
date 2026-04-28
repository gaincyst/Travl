const DEFAULT_FALLBACK_CHAR = 'U';

const pickSeed = (user = {}) => {
  if (user?.userId !== undefined && user?.userId !== null && user?.userId !== '') {
    return String(user.userId);
  }

  if (user?.id !== undefined && user?.id !== null && user?.id !== '') {
    return String(user.id);
  }

  return String(user?.name || user?.email || DEFAULT_FALLBACK_CHAR);
};

const hashString = (value) => {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }

  return Math.abs(hash);
};

const GRADIENTS = [
  ['#ff7e5f', '#feb47b'],
  ['#6a11cb', '#2575fc'],
  ['#43cea2', '#185a9d'],
  ['#f7971e', '#ffd200'],
  ['#00c6ff', '#0072ff'],
  ['#ff512f', '#dd2476'],
  ['#11998e', '#38ef7d'],
  ['#fc4a1a', '#f7b733']
];

export const generateGradient = (user = {}) => {
  const seed = pickSeed(user);
  const hash = hashString(seed);
  const index = hash % GRADIENTS.length;
  const [colorOne, colorTwo] = GRADIENTS[index];

  return `linear-gradient(135deg, ${colorOne}, ${colorTwo})`;
};

export const generateAvatar = (user = {}) => {
  const name = String(user?.name || user?.displayName || '').trim();
  const firstLetter = name ? name.charAt(0).toUpperCase() : DEFAULT_FALLBACK_CHAR;

  return {
    letter: firstLetter,
    background: generateGradient(user)
  };
};

export const getAvatarUrl = (user = {}) => {
  const avatarUrl = user?.avatarUrl ?? user?.avatar_url ?? '';
  return typeof avatarUrl === 'string' ? avatarUrl.trim() : '';
};
