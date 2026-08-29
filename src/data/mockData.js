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
  offering: 'Can teach: basic Tagalog phrases, adobo recipes',
  seeking: 'Want to learn: guitar basics',
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
    offering: 'Can teach: guitar basics, karaoke playlist curation',
    seeking: 'Want to learn: cooking adobo properly',
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
    offering: 'Can teach: strategy board games, pho broth basics',
    seeking: 'Want to learn: conversational Tagalog',
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
    offering: 'Can teach: hand-building ceramics',
    seeking: 'Want to learn: home cooking basics, company while eating',
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
    offering: 'Can teach: chess openings',
    seeking: 'Want to learn: board game strategy, new friends nearby',
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
    offering: 'Can teach: portrait photography basics',
    seeking: 'Want to learn: Filipino desserts',
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
