// Tag categories used for the block-signature visual and the matching score.
// type: 'hobby' | 'culture' | 'language'
export const TAG_COLORS = {
  hobby: '#F2A93B',   // marigold
  culture: '#FF6F61', // coral
  language: '#5EC8D8', // teal accent for language blocks
}

export const CURRENT_USER = {
  id: 'me',
  username: 'quiet_comet',
  neighborhood: 'Marrickville',
  tags: [
    { label: 'Home cooking', type: 'hobby' },
    { label: 'Filipino', type: 'culture' },
    { label: 'Tagalog', type: 'language' },
    { label: 'Board games', type: 'hobby' },
  ],
  skills: [
    { label: 'Basic Tagalog phrases', direction: 'teach', level: 'intermediate' },
    { label: 'Adobo recipes', direction: 'teach', level: 'advanced' },
    { label: 'Guitar basics', direction: 'learn', level: 'beginner' },
  ],
}

export const USERS = [
  {
    id: 'u1',
    username: 'sundial_kay',
    neighborhood: 'Marrickville',
    tags: [
      { label: 'Filipino', type: 'culture' },
      { label: 'Tagalog', type: 'language' },
      { label: 'Guitar', type: 'hobby' },
    ],
    skills: [
      { label: 'Guitar basics', direction: 'teach', level: 'intermediate' },
      { label: 'Karaoke playlist curation', direction: 'teach', level: 'advanced' },
      { label: 'Cooking adobo properly', direction: 'learn', level: 'beginner' },
    ],
  },
  {
    id: 'u2',
    username: 'paper_lantern',
    neighborhood: 'Newtown',
    tags: [
      { label: 'Board games', type: 'hobby' },
      { label: 'Vietnamese', type: 'culture' },
      { label: 'Vietnamese (lang)', type: 'language' },
    ],
    skills: [
      { label: 'Strategy board games', direction: 'teach', level: 'advanced' },
      { label: 'Pho broth basics', direction: 'teach', level: 'intermediate' },
      { label: 'Conversational Tagalog', direction: 'learn', level: 'beginner' },
    ],
  },
  {
    id: 'u3',
    username: 'moss_and_ink',
    neighborhood: 'Enmore',
    tags: [
      { label: 'Ceramics', type: 'hobby' },
      { label: 'Home cooking', type: 'hobby' },
      { label: 'Korean', type: 'culture' },
    ],
    skills: [
      { label: 'Hand-building ceramics', direction: 'teach', level: 'advanced' },
      { label: 'Home cooking basics', direction: 'learn', level: 'beginner' },
      { label: 'Company while eating', direction: 'learn', level: 'beginner' },
    ],
  },
  {
    id: 'u4',
    username: 'slow_river',
    neighborhood: 'Marrickville',
    tags: [
      { label: 'Board games', type: 'hobby' },
      { label: 'Chess', type: 'hobby' },
      { label: 'Greek', type: 'culture' },
    ],
    skills: [
      { label: 'Chess openings', direction: 'teach', level: 'intermediate' },
      { label: 'Board game strategy', direction: 'learn', level: 'beginner' },
      { label: 'New friends nearby', direction: 'learn', level: 'beginner' },
    ],
  },
  {
    id: 'u5',
    username: 'copper_finch',
    neighborhood: 'Petersham',
    tags: [
      { label: 'Filipino', type: 'culture' },
      { label: 'Home cooking', type: 'hobby' },
      { label: 'Photography', type: 'hobby' },
    ],
    skills: [
      { label: 'Portrait photography basics', direction: 'teach', level: 'intermediate' },
      { label: 'Filipino desserts', direction: 'learn', level: 'beginner' },
    ],
  },
]

// "Reverse loneliness" posts — a stated need matched to someone with that
// specific lived experience or skill, rather than generic interest matching.
export const NEED_POSTS = [
  {
    id: 'n1',
    author: 'moss_and_ink',
    need: 'I miss cooking with my mom. Would love company while I cook dinner sometime, even just to chat.',
    tags: ['Home cooking', 'Company'],
  },
  {
    id: 'n2',
    author: 'slow_river',
    need: "Just moved to the area and don't know anyone yet. Looking for a casual board game night.",
    tags: ['Board games', 'New to area'],
  },
  {
    id: 'n3',
    author: 'sundial_kay',
    need: 'Want to practice speaking Tagalog with someone patient — happy to trade for guitar lessons.',
    tags: ['Language exchange', 'Tagalog'],
  },
]
