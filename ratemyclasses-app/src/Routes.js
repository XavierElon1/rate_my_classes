/*eslint-disable */
import React from "react";
import { Switch, Route } from "react-router-dom";
import {
  LandingPage,
  RateCoursePage,
  RateUniversityPage,
  AddCoursePage,
  CourseInfo,
  InstitutionInfo,
  AuthPage,
  TestPage,
} from "./components";

function Routes() {
  return (
    <div>
      <Switch>
        <Route exact path="/" component={LandingPage} />
        <Route path="/rate-course" component={RateCoursePage} />
        <Route path="/add-course/:id" component={AddCoursePage} />
        <Route path="/rate-University" component={RateUniversityPage} />
        <Route path="/course-info/:uniId/:courseId" component={CourseInfo} />
        <Route path="/university-info/:id" component={InstitutionInfo} />
        <Route path="/auth/:token" component={AuthPage} />
      </Switch>
    </div>
  );
}

export default Routes;
