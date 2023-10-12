import {proxy} from 'valtio';

const state = proxy({
  currentProjectIndex: 0,
  projectList: [
    {
      name: 'Animate Anything',
      client: 'Anything World',
      year: '2023',
      thumbnail: 0
    },
    {
      name: 'Avatopia',
      client: 'Anything World',
      year: '2023',
      thumbnail: 1
    },
  ]
})


export default state;
