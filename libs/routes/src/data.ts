import { NewUser } from './schema';

type UserData = Omit<NewUser, 'id'>;

export const data: UserData[] = [
  {
    name: 'Esther Tillman',
    age: 24,
    gender: 'female',
    company: 'FILODYNE',
    isActive: true
  },
  {
    name: 'Wood Dunn',
    age: 32,
    gender: 'male',
    company: 'CRUSTATIA',
    isActive: false
  },
  {
    name: 'Walker Preston',
    age: 36,
    gender: 'male',
    company: 'COMTOURS',
    isActive: false
  },
  {
    name: 'Veronica Barnes',
    age: 28,
    gender: 'female',
    company: 'DRAGBOT',
    isActive: true
  },
  {
    name: 'Marie Clarke',
    age: 21,
    gender: 'female',
    company: 'MALATHION',
    isActive: true
  },
  {
    name: 'Madeleine Rose',
    age: 21,
    gender: 'female',
    company: 'ZANITY',
    isActive: true
  },
  {
    name: 'Hays Berger',
    age: 25,
    gender: 'male',
    company: 'STREZZO',
    isActive: false
  },
  {
    name: 'Frank Knowles',
    age: 38,
    gender: 'male',
    company: 'EXOBLUE',
    isActive: true
  },
  {
    name: 'Kerry Pollard',
    age: 21,
    gender: 'female',
    company: 'PHUEL',
    isActive: false
  },
  {
    name: 'Porter Parker',
    age: 28,
    gender: 'male',
    company: 'GORGANIC',
    isActive: false
  },
  {
    name: 'Estela Burnett',
    age: 31,
    gender: 'female',
    company: 'HOTCAKES',
    isActive: true
  },
  {
    name: 'Lamb Hoffman',
    age: 23,
    gender: 'male',
    company: 'CANOPOLY',
    isActive: true
  },
  {
    name: 'Ewing White',
    age: 26,
    gender: 'male',
    company: 'SARASONIC',
    isActive: true
  },
  {
    name: 'Slater Mckay',
    age: 26,
    gender: 'male',
    company: 'COMBOGEN',
    isActive: true
  },
  {
    name: 'Lucile Spencer',
    age: 27,
    gender: 'female',
    company: 'GEOSTELE',
    isActive: false
  },
  {
    name: 'Pauline Wilson',
    age: 32,
    gender: 'female',
    company: 'CHORIZON',
    isActive: false
  },
  {
    name: 'Gibbs Ballard',
    age: 27,
    gender: 'male',
    company: 'FLUM',
    isActive: true
  },
  {
    name: 'Aida Ortega',
    age: 20,
    gender: 'female',
    company: 'XIXAN',
    isActive: false
  },
  {
    name: 'Laurel Baker',
    age: 39,
    gender: 'female',
    company: 'PARCOE',
    isActive: false
  },
  {
    name: 'Krista Cross',
    age: 20,
    gender: 'female',
    company: 'DATAGENE',
    isActive: true
  }
];
