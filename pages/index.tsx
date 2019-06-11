// DOCS: https://levelup.gitconnected.com/ultimate-react-component-patterns-with-typescript-2-8-82990c516935
// DOCS: https://www.typescriptlang.org/docs/handbook/functions.html

import * as React          from 'react';
import GithubCorner      from "../src/components/GithubCorner/GithubCorner";
import GameOfLifeComponent from "../src/components/GameOfLife/GameOfLifeComponent";


const Home: React.FunctionComponent<JSX.Element> = () => {
    return (
        <>
            <GithubCorner/>
            <div style={{ maxWidth: "1000px", margin: "auto" }}>
                <GameOfLifeComponent/>
            </div>
        </>
    );
};

export default Home;
