// DOCS: https://levelup.gitconnected.com/ultimate-react-component-patterns-with-typescript-2-8-82990c516935
// DOCS: https://www.typescriptlang.org/docs/handbook/functions.html

import * as React from 'react';
import GameOfLife from "../src/components/GameOfLife/GameOfLife";


const Home: React.FunctionComponent<JSX.Element> = () => {
    return (
        <div style={{ maxWidth: 500 }}>
            <GameOfLife/>
        </div>
    );
};

export default Home;
