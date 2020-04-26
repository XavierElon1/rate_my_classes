import React from "react";
import { Switch, withRouter, Route } from "react-router-dom";
import * as styles from "./app.styles";

import RMCAppBar from "./components/RMCAppBar/RMCAppBar";
import NavigationTabs from "./components/NavigationTabs/NavigationTabs";
import LandingPage from "./pages/LandingPage";
import RateCoursePage from "./pages/RateCoursePage";
import RateUniversityPage from "./pages/RateUniversityPage";

function Routes() {
  return (
    <div className="App">
      <RMCAppBar />
      <NavigationTabs />
      <Switch>
        <Route exact path="/" component={LandingPage} />
        <Route path="/rate-course" component={RateCoursePage} />
        <Route path="/rate-University" component={RateUniversityPage} />
      </Switch>
    </div>
  );
}

export default withRouter(Routes);
