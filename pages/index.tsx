// DOCS: https://levelup.gitconnected.com/ultimate-react-component-patterns-with-typescript-2-8-82990c516935
// DOCS: https://www.typescriptlang.org/docs/handbook/functions.html

import React, { FunctionComponent } from 'react'
// function Home():FunctionComponent<{}> {
//     return <div>Welcome to Next.js!</div>
// };

const Home: FunctionComponent = () => {
    return <div>Welcome to Next.js!!!</div>
};

export default Home
