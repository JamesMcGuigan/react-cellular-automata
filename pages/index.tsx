// DOCS: https://levelup.gitconnected.com/ultimate-react-component-patterns-with-typescript-2-8-82990c516935
// DOCS: https://www.typescriptlang.org/docs/handbook/functions.html

import * as React from 'react';
import Grid from '../src/components/Grid';


const Home: React.FunctionComponent<JSX.Element> = () => {
    return (
        <Grid shape={[10, 10]}/>
    );
};

export default Home;
