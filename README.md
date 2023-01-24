# EDT

[![EDT CI](https://github.com/InseeFrLab/edt/actions/workflows/ci.yaml/badge.svg)](https://github.com/InseeFrLab/edt/actions/workflows/ci.yaml)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=InseeFrLab_edt&metric=coverage)](https://sonarcloud.io/dashboard?id=InseeFrLab_edt)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=InseeFrLab_edt&metric=alert_status)](https://sonarcloud.io/dashboard?id=InseeFrLab_edt)

# Technical documentation of Carnet EDT - ReactTS PWA

## General information

EDT is a ReactTS PWA front-end application.
It was made to allow INSEE (French public services) to do surveys based on their own data management and treatment system. The opensource data engine made by INSEE is called Lunatic.
The most reusable front-end components for any surveys such as input fields have been developped inside another project repository called Lunatic-Edt and is used as a library by EDT.
The app is using the embedded database of the navigator (IndexedDB) and is able to run offline as soon as the app have been loaded once. The user will need to recover internet connection at least to deliver his surveys answers when he finished.
EDT is calling two different API.
edt-pilotage API which is used to give to the surveyed their required surveys and surveyers their accessible surveys.
Stromae Back Office API which is used to GET all required nomenclatures for the application such as question answer options. It also allow the user to POST his surveys answers and GET it when he started a survey and then change device.

> Linked repositories :
>
> -   EDT Application : https://github.com/InseeFrLab/edt
> -   Lunatic : https://github.com/InseeFr/Lunatic
> -   Lunatic-EDT : https://github.com/InseeFrLab/lunatic-edt
> -   Edt-pilotage API : https://github.com/InseeFrLab/edt-management-api
> -   Stromae Back Office API : https://github.com/InseeFr/Queen-Back-Office

### Project structure

![](https://i.imgur.com/QfHCY1X.png)

`src` : Contains all the source code of the application. It also has the 2 surveys sources required by Lunatic and used by EDT. `activity-survey.json` is corresponding to the source of the activity survey and `work-time-survey.json` the one of the working time survey.

`service` : Contains all the app services. Please refer to the _Services_ section for further information.

`components` : Contains two folders. `commons` which has all the components that could be reusable in another app that would work like EDT using Lunatic. `edt` that has all the EDT specific components.

`interface` : Contains all the Typescript interfaces of the used entities, lunatic models etc...

`routes` : Contains `EdtRoutes.tsx` which holds the React BrowserRouter tag and all the navigation routes. `EdtRoutesMapping.ts` is holding the `mappingPageOrchestrator` (refer to the _Enumerations & Maps_ section).

`pages` : Contains all app pages. The `activity` folder holds the specific pages for the activity survey and `work-time` the ones for the work time survey. Other common pages are directly inside the `pages` folder.

`documentation` : Contains the app technical documentation.

`i18n` : Contains i18n configuration and `fr.json` which is the file that holds all the app labels including accessility labels.

`assets` : Contains all app assets such as svg icons or fonts.

### Authentification

#### Keycloak

[TO COMPLETE]

### APIs usage

#### Architecture schema

![](https://i.imgur.com/Q3sKoCe.png)

#### API Edt-pilotage

This API is used to GET the surveys ids to which the surveyed or the surveyers have access.

##### Used Endpoints :

[TO COMPLETE]

##### Dev API swagger :

https://edt-api.demo.insee.io/swagger-ui/index.html

##### Repository :

https://github.com/InseeFrLab/edt-management-api

#### API Queen Back Office

This API is used to GET all required nomenclatures for the application such as question answer options. It also allow the user to POST his surveys answers and GET it when he started a survey and then change device.

##### Used Endpoints :

[TO COMPLETE]

##### Dev API swagger :

https://stromae-edt.demo.insee.io/swagger-ui.html

##### Repository :

https://github.com/InseeFr/Queen-Back-Office

### Lunatic usage

Lunatic is used by EDT to :

-   Print the questions and associated surveys fields from the lunatic sources provided. In the case of EDT, the sources are `activity-survey.json` and `work-time-survey.json`.
-   Manage the data associated to the surveys fields described in the source.

> For EDT, we did not use Lunatic integrated navigation system because at the time of the development, it was not able to do what was required for this app.
> Thanks to the fact that Lunatic is fast, we integrated an Orchestrator (refer to Lunatic documentation) in each app page, that point directly to the good source page and component. This way, the data and survey questions are manage by standard Lunatic system but all the navigation and persistence system is handled by EDT.

### Lunatic EDT usage

This lib was designed to be integrated in the future inside another MUI reusable components lib of INSEE. This lib being in development at the time of EDT development, Lunatic-EDT was created to accelerate the process.

It contains all the survey "fields" components and an associated storybook documentation (please refer to Lunatic-EDT local install section to launch the storybook).

## Services

`alert-service.ts` : Used to get alert content.

`api-service.ts` : Contains all API calls.

`loop-service.ts` : Used to handle loop size and loop data to recover the current state of the navigation.

`loop-stepper-service.ts` : Used to get all loop steps data.

`lunatic-database.ts` : Contains database management and functions.

`navigation-service.ts` : Used to hold all navigation functions.

`orchestrator-service.ts` : Used to recover current source and survey.

`referentiel-service.ts` : Contains all the functions to recover data from nomenclature.

`responsive.ts` : Used to know about the current device (tablet, mobile, desktop). It also contains the maximum width in px to determine which kind of device is in use.

```
const mobileMaxWidth = 767;
const tabletMinWidth = 768;
const tabletMaxWidth = 991;
const destktopMinWidth = 992;
```

`stepper.service.ts` : Holds functions linked to the outside of loop steppers (such as end of survey stepper).

`survey-activity-service.ts` : Contains all the functions linked to the activity survey datas and treatments.

`survey-service.ts` : Contains all the functions that are generic about surveys data and treatments.

## Enumerations & Maps

### Enumerations

This section contains all the most important enumerations used by the EDT app. These enumerations have to be updated each time the source is edited (new variables, pages, ...)

#### FieldNameEnum :

```
const enum FieldNameEnum {
    LASTNAME = "LASTNAME",
    FIRSTNAME = "FIRSTNAME",
    SURVEYDATE = "SURVEYDATE",
    STARTTIME = "STARTTIME",
    ENDTIME = "ENDTIME",
    MAINACTIVITY_ID = "MAINACTIVITY_ID",
    MAINACTIVITY_SUGGESTERID = "MAINACTIVITY_SUGGESTERID",
    MAINACTIVITY_ISFULLYCOMPLETED = "MAINACTIVITY_ISFULLYCOMPLETED",
    MAINACTIVITY_LABEL = "MAINACTIVITY_LABEL",
    ROUTE = "ROUTE",
    GOAL = "GOAL",
    WITHSECONDARYACTIVITY = "WITHSECONDARYACTIVITY",
    SECONDARYACTIVITY = "SECONDARYACTIVITY",
    FOOT = "FOOT",
    BICYCLE = "BICYCLE",
    TWOWHEELSMOTORIZED = "TWOWHEELSMOTORIZED",
    PRIVATECAR = "PRIVATECAR",
    OTHERPRIVATE = "OTHERPRIVATE",
    PUBLIC = "PUBLIC",
    PLACE = "PLACE",
    WITHSOMEONE = "WITHSOMEONE",
    COUPLE = "COUPLE",
    PARENTS = "PARENTS",
    CHILD = "CHILD",
    OTHERKNOWN = "OTHERKNOWN",
    OTHER = "OTHER",
    WITHSCREEN = "WITHSCREEN",
    WEEKLYPLANNER = "WEEKLYPLANNER",
    WORKINGWEEK = "WORKINGWEEK",
    HOLIDAYWEEK = "HOLIDAYWEEK",
    OTHERWEEK = "OTHERWEEK",
    GREATESTACTIVITYDAY = "GREATESTACTIVITYDAY",
    WORSTACTIVITYDAY = "WORSTACTIVITYDAY",
    KINDOFDAY = "KINDOFDAY",
    EXCEPTIONALDAY = "EXCEPTIONALDAY",
    TRAVELTIME = "TRAVELTIME",
    PHONETIME = "PHONETIME",
    ISCLOSED = "ISCLOSED",
    ISROUTE = "ISROUTE",
    ISCOMPLETED = "ISCOMPLETED",
}
```

Usage : this enumeration is used to do the link between all the variables from the Lunatic source and the app services.
It is composed of all the variables declared in the `variables` section of the source/s.
In the case of EDT, it contains the variables from `activity-survey.json` and `work-time-survey.json`.

#### EdtRoutesNameEnum :

```
export enum EdtRoutesNameEnum {
    HELP = "help",
    ERROR = "error",
    ACTIVITY = "activity/:idSurvey",
    WHO_ARE_YOU = "who-are-you",
    DAY_OF_SURVEY = "day-of-survey",
    WORK_TIME = "work-time/:idSurvey",
    EDIT_GLOBAL_INFORMATION = "edit-global-information",
    WEEKLY_PLANNER = "weekly-planner",
    KIND_OF_WEEK = "kind-of-week",
    ACTIVITY_OR_ROUTE_PLANNER = "activity-or-route-planner",
    EDIT_ACTIVITY_INFORMATION = "edit-activity-information/:iteration",
    ACTIVITY_DURATION = "activity-duration/:iteration",
    MAIN_ACTIVITY = "main-activity/:iteration",
    MAIN_ACTIVITY_GOAL = "main-activity-goal/:iteration",
    ROUTE = "route/:iteration",
    SECONDARY_ACTIVITY = "secondary-activity/:iteration",
    SECONDARY_ACTIVITY_SELECTION = "secondary-activity-selection/:iteration",
    MEAN_OF_TRANSPORT = "mean-of-transport/:iteration",
    ACTIVITY_LOCATION = "activity-location/:iteration",
    WITH_SOMEONE = "with-who/:iteration",
    WITH_SOMEONE_SELECTION = "with-who-selection/:iteration",
    WITH_SCREEN = "with-screen/:iteration",
    GREATEST_ACTIVITY_DAY = "greatest-activity-day",
    WORST_ACTIVITY_DAY = "worst-activity-day",
    KIND_OF_DAY = "kind-of-day",
    EXCEPTIONAL_DAY = "exceptional-day",
    TRAVEL_TIME = "travel-time",
    PHONE_TIME = "phone-time",
}
```

Usage : This enumeration contains all the routes used by the app to navigate.

### Maps

#### mappingPageOrchestrator :

```
let mappingPageOrchestrator: OrchestratorEdtNavigation[] = [
    {
        parentPage: EdtRoutesNameEnum.ACTIVITY,
        page: EdtRoutesNameEnum.WHO_ARE_YOU,
        surveySource: "activity-survey.json",
        surveyPage: "1",
    },
    {
        parentPage: EdtRoutesNameEnum.ACTIVITY,
        page: EdtRoutesNameEnum.DAY_OF_SURVEY,
        surveySource: "activity-survey.json",
        surveyPage: "2",
    },
    {
        parentPage: EdtRoutesNameEnum.ACTIVITY,
        page: EdtRoutesNameEnum.ACTIVITY_OR_ROUTE_PLANNER,
        surveySource: "activity-survey.json",
        surveyPage: "3",
    },
    {
        parentPage: EdtRoutesNameEnum.ACTIVITY_OR_ROUTE_PLANNER,
        page: EdtRoutesNameEnum.ACTIVITY_DURATION,
        surveySource: "activity-survey.json",
        surveyPage: getLoopInitialPage(LoopEnum.ACTIVITY_OR_ROUTE),
        surveySubPage: "2",
        surveyStep: 1,
    },
    {
        parentPage: EdtRoutesNameEnum.ACTIVITY_OR_ROUTE_PLANNER,
        page: EdtRoutesNameEnum.MAIN_ACTIVITY,
        surveySource: "activity-survey.json",
        surveyPage: getLoopInitialPage(LoopEnum.ACTIVITY_OR_ROUTE),
        surveySubPage: "3",
        surveyStep: 2,
    },
    {
        parentPage: EdtRoutesNameEnum.ACTIVITY_OR_ROUTE_PLANNER,
        page: EdtRoutesNameEnum.ROUTE,
        surveySource: "activity-survey.json",
        surveyPage: getLoopInitialPage(LoopEnum.ACTIVITY_OR_ROUTE),
        surveySubPage: "4",
        surveyStep: 2,
    },
    {
        parentPage: EdtRoutesNameEnum.ACTIVITY_OR_ROUTE_PLANNER,
        page: EdtRoutesNameEnum.MEAN_OF_TRANSPORT,
        surveySource: "activity-survey.json",
        surveyPage: getLoopInitialPage(LoopEnum.ACTIVITY_OR_ROUTE),
        surveySubPage: "5",
        surveyStep: 3,
    },
    {
        parentPage: EdtRoutesNameEnum.ACTIVITY_OR_ROUTE_PLANNER,
        page: EdtRoutesNameEnum.SECONDARY_ACTIVITY,
        surveySource: "activity-survey.json",
        surveyPage: getLoopInitialPage(LoopEnum.ACTIVITY_OR_ROUTE),
        surveySubPage: "6",
        surveyStep: 3,
    },
    {
        parentPage: EdtRoutesNameEnum.ACTIVITY_OR_ROUTE_PLANNER,
        page: EdtRoutesNameEnum.ACTIVITY_LOCATION,
        surveySource: "activity-survey.json",
        surveyPage: getLoopInitialPage(LoopEnum.ACTIVITY_OR_ROUTE),
        surveySubPage: "7",
        surveyStep: 4,
    },
    {
        parentPage: EdtRoutesNameEnum.ACTIVITY_OR_ROUTE_PLANNER,
        page: EdtRoutesNameEnum.WITH_SOMEONE,
        surveySource: "activity-survey.json",
        surveyPage: getLoopInitialPage(LoopEnum.ACTIVITY_OR_ROUTE),
        surveySubPage: "8",
        surveyStep: 5,
    },
    {
        parentPage: EdtRoutesNameEnum.ACTIVITY_OR_ROUTE_PLANNER,
        page: EdtRoutesNameEnum.WITH_SCREEN,
        surveySource: "activity-survey.json",
        surveyPage: getLoopInitialPage(LoopEnum.ACTIVITY_OR_ROUTE),
        surveySubPage: "9",
        surveyStep: 6,
    },
    {
        parentPage: EdtRoutesNameEnum.ACTIVITY_OR_ROUTE_PLANNER,
        page: EdtRoutesNameEnum.MAIN_ACTIVITY_GOAL,
        surveySource: "activity-survey.json",
        surveyPage: getLoopInitialPage(LoopEnum.ACTIVITY_OR_ROUTE),
        surveySubPage: "10",
        surveyStep: 2,
    },
    {
        parentPage: EdtRoutesNameEnum.ACTIVITY_OR_ROUTE_PLANNER,
        page: EdtRoutesNameEnum.SECONDARY_ACTIVITY_SELECTION,
        surveySource: "activity-survey.json",
        surveyPage: getLoopInitialPage(LoopEnum.ACTIVITY_OR_ROUTE),
        surveySubPage: "11",
        surveyStep: 3,
    },
    {
        parentPage: EdtRoutesNameEnum.ACTIVITY_OR_ROUTE_PLANNER,
        page: EdtRoutesNameEnum.WITH_SOMEONE_SELECTION,
        surveySource: "activity-survey.json",
        surveyPage: getLoopInitialPage(LoopEnum.ACTIVITY_OR_ROUTE),
        surveySubPage: "12",
        surveyStep: 5,
    },
    {
        parentPage: EdtRoutesNameEnum.ACTIVITY,
        page: EdtRoutesNameEnum.GREATEST_ACTIVITY_DAY,
        surveySource: "activity-survey.json",
        surveyPage: "5",
    },
    {
        parentPage: EdtRoutesNameEnum.ACTIVITY,
        page: EdtRoutesNameEnum.WORST_ACTIVITY_DAY,
        surveySource: "activity-survey.json",
        surveyPage: "6",
    },
    {
        parentPage: EdtRoutesNameEnum.ACTIVITY,
        page: EdtRoutesNameEnum.KIND_OF_DAY,
        surveySource: "activity-survey.json",
        surveyPage: "7",
    },
    {
        parentPage: EdtRoutesNameEnum.ACTIVITY,
        page: EdtRoutesNameEnum.EXCEPTIONAL_DAY,
        surveySource: "activity-survey.json",
        surveyPage: "8",
    },
    {
        parentPage: EdtRoutesNameEnum.ACTIVITY,
        page: EdtRoutesNameEnum.TRAVEL_TIME,
        surveySource: "activity-survey.json",
        surveyPage: "9",
    },
    {
        parentPage: EdtRoutesNameEnum.ACTIVITY,
        page: EdtRoutesNameEnum.PHONE_TIME,
        surveySource: "activity-survey.json",
        surveyPage: "10",
    },
    {
        parentPage: EdtRoutesNameEnum.ACTIVITY,
        page: EdtRoutesNameEnum.EDIT_GLOBAL_INFORMATION,
        surveySource: "activity-survey.json",
        surveyPage: "3",
    },
    {
        parentPage: EdtRoutesNameEnum.WORK_TIME,
        page: EdtRoutesNameEnum.WHO_ARE_YOU,
        surveySource: "work-time-survey.json",
        surveyPage: "1",
    },
    {
        parentPage: EdtRoutesNameEnum.WORK_TIME,
        page: EdtRoutesNameEnum.DAY_OF_SURVEY,
        surveySource: "work-time-survey.json",
        surveyPage: "2",
    },
    {
        parentPage: EdtRoutesNameEnum.WORK_TIME,
        page: EdtRoutesNameEnum.WEEKLY_PLANNER,
        surveySource: "work-time-survey.json",
        surveyPage: "3",
    },
    {
        parentPage: EdtRoutesNameEnum.WORK_TIME,
        page: EdtRoutesNameEnum.KIND_OF_WEEK,
        surveySource: "work-time-survey.json",
        surveyPage: "4",
    },
    {
        parentPage: EdtRoutesNameEnum.WORK_TIME,
        page: EdtRoutesNameEnum.EDIT_GLOBAL_INFORMATION,
        surveySource: "work-time-survey.json",
        surveyPage: "5",
    },
];
```

Usage : This map is used to do the link between the Lunatic source and the app navigation.

## Maintenance and evolution

### Install local development environment

#### EDT local install

Clone the EDT project from github repository :

```
> git clone https://github.com/InseeFrLab/edt.git
```

Install dependencies with Yarn :

```
> cd edt
> yarn install
```

Run the app on local :

```
> yarn start
```

You should now be able to access the app on :

http://localhost:3000/

#### Lunatic-EDT local install

Clone the Lunatic-EDT project from github repository :

```
> git clone https://github.com/InseeFrLab/lunatic-edt
```

Install dependencies with Yarn :

```
> cd lunatic-edt
> yarn install
```

Run the storybook on local :

```
> yarn storybook
```

You should now be able to access the app on :

[http://localhost:6006/](https://)

#### Run EDT in local using Lunatic-EDT local environment

This is useful if you want to develop Lunatic-EDT seeing directly your changes inside EDT application.
You need to complete the 2 previous install steps before follow this one.

Go inside Lunatic-EDT and create a yarn link :

```
> cd lunatic-edt
> yarn link
```

Once this is done, you can now make EDT to use this yarn link :

```
> cd edt
> yarn link "lunatic-edt"
> yarn install
```

EDT is now using your local Lunatic-EDT build as lib instead of npm repository.

To be able to develop both project synchronously and see your changes of Lunatic-EDT in real time inside EDT, run the app with :

```
> yarn start-with-lib
```

This will run a watcher on Lunatic-EDT that execute a build of Lunatic-EDT on each save. This watcher is running concurrently with the yarn start of EDT. This allows EDT to recompile each time Lunatic-EDT build changed.

### Add a survey page

To add a survey page inside the app, you should follow these steps :

-   Complete the source file you wish to edit with your new variables and components information.
    > If you wish to know more about how to edit a Lunatic source, please refer to the Lunatic documentation. (https://github.com/InseeFr/Lunatic)
-   Add any new variable inside the `FieldNameEnum` enumeration.
-   Add your page inside the map `mappingPageOrchestrator`
-   Create your new `tsx` page in the right section of `src/pages`
-   Refer to any other page close from your goal to see how to use the existing navigation and components deppending on if you are creating a page inside a loop or outside. You can also see there how to use the Orchestrator component and how it recovers the wished Lunatic model page from the source.
-   If your page contains more labels than the survey question label, please add it in the `src/i18n` section.
-   Add your new route inside the `src/routes/EdtRoutes.tsx` file which needs the `EdtRoutesNameEnum` enumeration to be incremented as well.

You should now be able to test your development.

### Edit a label

#### Survey label

A survey label is a label that is linked to an answer of the user. Most of the time it is a question. Those labels can be found in the related survey source : `activity-survey.json` or `work-time-survey.json`. Refer to the map `mappingPageOrchestrator` to find which source your page is using and the `surveyPage` property to find your `component` in the source. There you sould be able to edit the `label`.

#### App label

All the labels that are not directly related to the survey answers are referenced inside the `fr.json` file in the `src/i18n` folder.

## Qualimetry and Tests

### Sonar

Sonar quality have been treated using INSEE default configuration. You can refer to the Github pipeline to see which configuration is used.

### Test E2E

E2E tests using React Testing Library have been done to cover the nominal navigation of the app.
[TO COMPLETE]

### Unit Tests

JEST Unit tests have been done to cover the complexe Lunatic-EDT components such as `ActivitySelecter` or `HourChecker`.
Run `yarn test` command inside Lunatic-EDT to execute the tests.
