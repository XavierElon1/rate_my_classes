/*eslint-disable */
import React from "react";
import { Switch, Route } from "react-router-dom";
import {
  LandingPage,
  RateCoursePage,
  RateUniversityPage,
  AddCoursePage,
} from "./components";

function Routes() {
  return (
    <div>
      <Switch>
        <Route exact path="/" component={LandingPage} />
        <Route path="/rate-course" component={RateCoursePage} />
        <Route path="/add-course" component={AddCoursePage} />
        <Route path="/rate-University" component={RateUniversityPage} />
      </Switch>
    </div>
  );
}

export default Routes;
