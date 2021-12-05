// import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import React from 'react';
// import TestComponent from './testcomponent';

// function AssetRegistryReact() {
//     return (
//         // eslint-disable-next-line react/jsx-filename-extension
//         <div>
//             <Router>
//                 <Switch>
//                     <Route path="/" exact component={TestComponent} />
//                 </Switch>
//             </Router>
//         </div>
//     );
// }

// export default AssetRegistryReact;
import { BrowserRouter as Router, Route,Switch } from 'react-router-dom';

const Home = () => <h1>Home</h1>;

const AssetRegistryReact = () => (
    <Router>
        <Switch>
            <Route path="/" component={Home} />
        </Switch>
    </Router>
);

export default AssetRegistryReact;
