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

### Lunatic usage

Lunatic is used by EDT to :

-   Print the questions and associated surveys fields from the lunatic sources provided. In the case of EDT, the sources ids are `edt-activity-survey` and `edt-work-time-survey` (recovered via API call to stromae back office `GET questionnaire/{id}`).

<details>
<summary>Source example : </summary>
<br>

```
{
    "pagination": "question",
    "lunaticModelVersion": "2.2.10",
    "modele": "TIME",
    "enoCoreVersion": "2.3.11",
    "generatingDate": "29-09-2022 13:56:00",
    "missing": false,
    "id": "l8lq5lp6",
    "label": "Time",
    "maxPage": "3",
    "variables": [
        {
            "variableType": "COLLECTED",
            "values": {
                "COLLECTED": null,
                "EDITED": null,
                "INPUTED": null,
                "FORCED": null,
                "PREVIOUS": null
            },
            "name": "FIRSTNAME",
            "componentRef": "inputtext_firstName"
        },
        {
            "variableType": "COLLECTED",
            "values": {
                "COLLECTED": null,
                "EDITED": null,
                "INPUTED": null,
                "FORCED": null,
                "PREVIOUS": null
            },
            "name": "SURVEYDATE",
            "componentRef": "datepicker_surveyDate"
        },
        {
            "variableType": "COLLECTED",
            "values": {
                "COLLECTED": [null],
                "EDITED": [null],
                "INPUTED": [null],
                "FORCED": [null],
                "PREVIOUS": [null]
            },
            "name": "WEEKLYPLANNER",
            "componentRef": "weeklyplanner_value"
        },
        {
            "variableType": "COLLECTED",
            "values": {
                "COLLECTED": null,
                "EDITED": null,
                "INPUTED": null,
                "FORCED": null,
                "PREVIOUS": null
            },
            "name": "WEEKTYPE",
            "componentRef": "checkboxone_weektype"
        },
        {
            "variableType": "CALCULATED",
            "expression": "true",
            "name": "FILTER_RESULT_INPUTTEXT",
            "inFilter": "false"
        },
        {
            "variableType": "CALCULATED",
            "expression": "true",
            "name": "FILTER_RESULT_DATEPICKER",
            "inFilter": "false"
        }
    ],
    "components": [
        {
            "componentType": "Sequence",
            "hierarchy": {
                "sequence": { "id": "sequence_1", "page": "1" }
            },
            "conditionFilter": { "value": "true" },
            "id": "sequence_1",
            "page": "1",
            "label": ""
        },
        {
            "componentType": "Input",
            "bindingDependencies": ["FIRSTNAME"],
            "response": { "name": "FIRSTNAME" },
            "hierarchy": {
                "sequence": { "id": "sequence_1", "page": "1" }
            },
            "conditionFilter": { "value": "true" },
            "id": "inputtext_firstName",
            "page": "1",
            "label": "\"Qui êtes-vous ?\"",
            "placeholder": "Prénom",
            "mandatory": true,
            "maxLength": 100,
            "controls": [
                {
                    "criticality": "ERROR",
                    "errorMessage": {
                        "type": "VTL|MD",
                        "value": "\" La valeur doit être rempli.\""
                    },
                    "typeOfControl": "FORMAT",
                    "control": {
                        "type": "VTL",
                        "value": "not(isnull(FIRSTNAME)) and length(FIRSTNAME) >= 1"
                    },
                    "id": "kze792d8-formatBorneInfSup"
                }
            ]
        },
        {
            "componentType": "Datepicker",
            "bindingDependencies": ["SURVEYDATE"],
            "min": "1900-01-01",
            "max": "format-date(current-date(),'[Y0001]-[M01]-[D01]')",
            "dateFormat": "YYYY-MM-DD",
            "response": { "name": "SURVEYDATE" },
            "hierarchy": {
                "sequence": { "id": "sequence_1", "page": "1" }
            },
            "conditionFilter": { "value": "true" },
            "id": "datepicker_surveyDate",
            "page": "2",
            "label": "\"Quel est le premier jour de votre semaine ?\"",
            "mandatory": false,
            "controls": [
                {
                    "criticality": "ERROR",
                    "errorMessage": {
                        "type": "VTL|MD",
                        "value": "\" La valeur doit être rempli.\""
                    },
                    "typeOfControl": "FORMAT",
                    "control": {
                        "type": "VTL",
                        "value": "not(isnull(SURVEYDATE)) and length(SURVEYDATE) >= 1"
                    },
                    "id": "kze792d8-inputSurveyDate"
                }
            ]
        },
        {
            "componentType": "WeeklyPlanner",
            "bindingDependencies": ["WEEKLYPLANNER"],
            "response": {
                "name": "WEEKLYPLANNER"
            },
            "hierarchy": {
                "sequence": {
                    "id": "sequence_1",
                    "page": "1"
                }
            },
            "conditionFilter": {
                "value": "true"
            },
            "id": "weeklyplanner_value",
            "page": "3",
            "mandatory": false,
            "title": "Planning de votre semaine",
            "workSumLabel": "Durée totale travaillée : ",
            "presentButtonLabel": "Continuer",
            "futureButtonLabel": "Commencer"
        },
        {
            "componentType": "CheckboxOneEdt",
            "bindingDependencies": ["WEEKTYPE"],
            "response": { "name": "WEEKTYPE" },
            "hierarchy": {
                "sequence": {
                    "id": "sequence_1",
                    "page": "1"
                }
            },
            "conditionFilter": { "value": "true" },
            "id": "checkboxone_weektype",
            "page": "4",
            "label": "\"De quel type de semaine s’agissait-il ?\"",
            "mandatory": false
        },
        {
            "componentType": "Input",
            "bindingDependencies": ["FIRSTNAME"],
            "response": { "name": "FIRSTNAME" },
            "hierarchy": {
                "sequence": { "id": "sequence_1", "page": "1" }
            },
            "conditionFilter": { "value": "true" },
            "id": "inputtext_firstName2",
            "page": "5",
            "label": "\"Vos informations : \"",
            "placeholder": "Prénom",
            "mandatory": true,
            "maxLength": 100,
            "controls": [
                {
                    "criticality": "ERROR",
                    "errorMessage": {
                        "type": "VTL|MD",
                        "value": "\" Le prénom doit être saisi.\""
                    },
                    "typeOfControl": "FORMAT",
                    "control": {
                        "type": "VTL",
                        "value": "not(isnull(FIRSTNAME)) and length(FIRSTNAME) >= 1"
                    },
                    "id": "kze792d8-formatBornInfSup2"
                }
            ]
        },
        {
            "componentType": "Datepicker",
            "bindingDependencies": ["SURVEYDATE"],
            "min": "1900-01-01",
            "max": "format-date(current-date(),'[Y0001]-[M01]-[D01]')",
            "dateFormat": "YYYY-MM-DD",
            "response": { "name": "SURVEYDATE" },
            "hierarchy": {
                "sequence": { "id": "sequence_1", "page": "1" }
            },
            "conditionFilter": { "value": "true" },
            "id": "datepicker_surveyDate2",
            "page": "5",
            "label": "\"Le premier jour de votre semaine : \"",
            "mandatory": false,
            "controls": [
                {
                    "criticality": "ERROR",
                    "errorMessage": {
                        "type": "VTL|MD",
                        "value": "\" La date doit être saisie.\""
                    },
                    "typeOfControl": "FORMAT",
                    "control": {
                        "type": "VTL",
                        "value": "not(isnull(SURVEYDATE)) and length(SURVEYDATE) >= 1"
                    },
                    "id": "kze792d8-inputSurveyDate2"
                }
            ]
        }
    ]
}

```

</details>
<br>
- Manage the data associated to the surveys fields described in the source.

> For EDT, we did not use Lunatic integrated navigation system because at the time of the development, it was not able to do what was required for this app.
> Thanks to the fact that Lunatic is fast, we integrated an Orchestrator (refer to https://github.com/InseeFr/Lunatic) in each app page, that point directly to the good source page and component. This way, the data and survey questions are manage by standard Lunatic system but all the navigation and persistence system is handled by EDT.

### Lunatic EDT usage

This lib was designed to be integrated in the future inside another MUI reusable components lib of INSEE. This lib being in development at the time of EDT development, Lunatic-EDT was created to accelerate the process.

It contains all the survey "fields" components and an associated storybook documentation (please refer to Lunatic-EDT local install section to launch the storybook).

### Project structure

![](https://i.imgur.com/Jt1FrnR.png)

`src` : Contains all the source code of the application. It also has the 2 surveys sources required by Lunatic and used by EDT.

`enumerations` : Contains all enumerations of the application.

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

EDT is using a Keycloak for authentification. It uses `oidc-react` (https://github.com/bjerkio/oidc-react) to manage the connection between the Keycloak and the app.

These two environment variables are used to setup the connection :

```
REACT_APP_KEYCLOAK_AUTHORITY=https://auth.demo.insee.io/auth/realms/questionnaires-edt/
REACT_APP_KEYCLOAK_CLIENT_ID=client-edt
```

The user bearer token is used to call the secured APIs.

The accounts are created and managed by INSEE. It is not possible to sign up by yourself.

### APIs usage

#### Architecture schema

![](https://i.imgur.com/Q3sKoCe.png)

#### API Edt-pilotage

This API is used to GET the surveys ids to which the surveyed or the surveyers have access.

##### Used Endpoints :

`GET /survey-assigment/interviewer/my-surveys` : Get all the survey assigments for an interviewer

<details>
<summary>Answer format</summary>
<br>

```
[
  {
    "id": 0,
    "interviewerId": "string",
    "surveyUnitId": "string",
    "reviewerId": "string",
    "campaignId": "string",
    "questionnaireModelId": "string"
  }
]
```

</details>

##### Dev API swagger :

https://edt-api-kc.demo.insee.io/swagger-ui/index.html

##### Repository :

https://github.com/InseeFrLab/edt-management-api

#### API Queen Back Office

This API is used to GET all required nomenclatures for the application such as question answer options. It also allow the user to POST his surveys answers and GET it when he started a survey and then change device.

##### Used Endpoints :

`GET questionnaire/{id}` : json of survey model (source).

<details>
<summary>Answer format</summary>
<br>

```
{
  "model": {
    "variables": [
      {
        "name": "LAST_BROADCAST",
        "value": null,
        "variableType": "EXTERNAL"
      },
      {
        "name": "COMMENT",
        "responseRef": "COMMENT",
        "variableType": "COLLECTED"
      },
      ...
    ]
  }
}
```

</details>

---

`GET /nomenclature/{id}` : json of nomenclature

<details>
<summary>Answer format</summary>
<br>
    
  ```
[
  {
    "reg": "01",
    "cheflieu": 97105,
    "libelle": "Guadeloupe",
    "tncc": 3,
    "nccenr": "Guadeloupe",
    "ncc": "GUADELOUPE"
  },
  {
    "reg": "02",
    "cheflieu": 97209,
    "libelle": "Martinique",
    "tncc": 3,
    "nccenr": "Martinique",
    "ncc": "MARTINIQUE"
  },
  {
    "reg": "03",
    "cheflieu": 97302,
    "libelle": "Guyane",
    "tncc": 3,
    "nccenr": "Guyane",
    "ncc": "GUYANE"
  },
  ...
]
```  
</details>

---

`GET /survey-unit/{id}` : get a survey unit by id

<details>
<summary>Answer format</summary>
<br>
    
  ```
 {
  "stateData": {
    "state": ENUM ["INIT", "VALIDATED", 
 "TO-EXTRACT","EXTRACTED"]
    "date": Number (milisec since 1/1/1970)
    "currentPage": Integer
  },

"personalization": JsonArray,

"data": JsonObject
}

```
</details>


---

`PUT /survey-unit/{id}` : Edit a survey unit by id


<details>
<summary>Body format</summary>
<br>

```

{
"stateData": {
"state": ENUM ["INIT", "VALIDATED",
"TO-EXTRACT","EXTRACTED"]
"date": Number (milisec since 1/1/1970)
"currentPage": Integer
},

"personalization": JsonArray,

"data": JsonObject
}

```
</details>


##### Dev API swagger :
https://stromae-edt-kc.demo.insee.io/swagger-ui.html

##### Repository :
https://github.com/InseeFr/Queen-Back-Office

## Services
`alert-service.ts` : Used to get alert content.

`api-service.ts` : Contains all API calls.

`loop-service.ts` : Used to handle loop size and loop data to recover the current state of the navigation.

`loop-stepper-service.ts` : Used to get all loop steps data.

`lunatic-database.ts` : Contains database management and functions.

`navigation-service.ts` : Used to hold all navigation functions.

`orchestrator-service.ts` : Used to recover current source and survey.

`referentiel-service.ts` : Contains all the functions to recover data from nomenclature.

`responsive.ts` : Used to know about the current device (tablet, mobile, desktop). It also contains the maximum  width in px to determine which kind of device is in use.

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

<details>
<summary>SourcesEnum :</summary>
<br>

```

export enum SourcesEnum {
ACTIVITY_SURVEY = "edt-activity-survey",
WORK_TIME_SURVEY = "edt-work-time-survey",
}

```
</details>
<br>

Usage : this enumeration is used to define the Lunatic sources ids that are used by EDT.

---

<details>
<summary>ReferentielsEnum :</summary>
<br>

```

export enum ReferentielsEnum {
ACTIVITYNOMENCLATURE = "edt-activityCategory",
ACTIVITYAUTOCOMPLETE = "edt-activityAutoComplete",
ROUTE = "edt-route",
ACTIVITYSECONDARYACTIVITY = "edt-activitySecondaryActivity",
ROUTESECONDARYACTIVITY = "edt-routeSecondaryActivity",
LOCATION = "edt-place",
KINDOFWEEK = "edt-kindOfWeek",
KINDOFDAY = "edt-kindOfDay",
}

```
</details>
<br>

Usage : this enumeration is used to define the nomenclature ids that are used by EDT in order to be able to recover it by id from API call (please refer to Stromae Back Office API section).

---

<details>
<summary>FieldNameEnum :</summary>

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
</details>
<br>

Usage : this enumeration is used to do the link between all the variables from the Lunatic source and the app services.
It is composed of all the variables declared in the `variables` section of the source/s.
In the case of EDT, it contains the variables from `edt-activity-survey` and `edt-work-time-survey`.


---
<details>
<summary>EdtRoutesNameEnum :</summary>
<br>

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
</details>
<br>

Usage : This enumeration contains all the routes used by the app to navigate.


---

### Maps

<details>
<summary>mappingPageOrchestrator :</summary>
<br>

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
</details>
<br>

Usage : This map is used to do the link between the Lunatic source and the app navigation.

### Environment variables

EDT is using `react-script` default environment variables system. Please refer to https://create-react-app.dev/docs/adding-custom-environment-variables/ to know more about it.

The `.env.development` file is used when EDT is compiled in local.
The `.env.production` file is used when the builded app is hosted.

<details>
<summary>.env.production file</summary>
<br>

```

REACT_APP_STROMAE_BACK_OFFICE_API_BASE_URL=https://stromae-edt-kc.demo.insee.io/
REACT_APP_EDT_ORGANISATION_API_BASE_URL=https://edt-api-kc.demo.insee.io/
REACT_APP_KEYCLOAK_AUTHORITY=https://auth.demo.insee.io/auth/realms/questionnaires-edt/
REACT_APP_KEYCLOAK_CLIENT_ID=client-edt
REACT_APP_KEYCLOAK_REDIRECT_URI=https://insee-edt.k8s.keyconsulting.fr/

```
</details>

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
Init husky :
```

> npx husky install

```
:::info
:information_source: Husky (https://typicode.github.io/husky/#/) is used in this project to ensure the quality of the repository. It is used to add git hooks and run it on each commit. In this project, it obligate the developer to commit meeting the conventional commit standards (https://github.com/conventional-changelog/commitlint/#what-is-commitlint). Husky also runs the `yarn lint` and `yarn format` commands to meet INSEE's code lint standards.
:::

Run the app on local :
```

> yarn start

```
You should now be able to access the app on :

http://localhost:3000/

#### Lunatic EDT local install
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
:::info
:information_source: To know more about yarn link, please refer to : https://classic.yarnpkg.com/lang/en/docs/cli/link/
:::
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
### Style and CSS

Both projects are using TSS-React (https://www.tss-react.dev/) that allows to include the style directly inside de `tsx` component file. It has been developed using css flex properties as much as possible. The style is made to be responsive and is working on mobile device, tablet or desktop.

Material UI (https://mui.com/) for React is used as much in Lunatic-EDT as in EDT.
You will find the EDT material UI custom theme inside the Lunatic-EDT project under the `/src/ui/theme` folder.

<details>
<summary>Theme</summary>
<br>

```

variables: {
neutral: "#DCE7F9",
iconRounding: "#DEE2EB",
white: "#FFFFFF",
modal: "#F3F2F8",
alertActivity: "#B6462C",
},
palette: {
primary: {
main: "#4973D2",
light: "#2C70DE",
},
secondary: {
main: "#1F4076",
},
background: {
default: "#F2F1F7",
paper: "#E4E5EF",
},
error: {
main: "#B6462C",
light: "#FCE7D8",
},
success: {
main: "#C1EDC3",
},
info: {
main: "#1F4076",
},
warning: {
main: "#F4E289",
},
text: {
primary: "#1F4076",
secondary: "#2E384D",
},
action: {
hover: "#5C6F99",
},
},

```
</details>

### Add a survey page
To add a survey page inside the app, you should follow these steps :
- Complete the source file you wish to edit with your new variables and components information.
>If you wish to know more about how to edit a Lunatic source, please refer to the Lunatic documentation. (https://github.com/InseeFr/Lunatic)
- Add any new variable inside the `src/enumerations/FieldNameEnum` enumeration.
- Add your page inside the map `src/routes/EdtRoutesMapping.ts` `mappingPageOrchestrator`
- Create your new `tsx` page in the right section of `src/pages`
- Refer to any other page close from your goal to see how to use the existing navigation and components deppending on if you are creating a page inside a loop or outside. You can also see there how to use the Orchestrator component and how it recovers the wished Lunatic model page from the source.
- If your page contains more labels than the survey question label, please add it in the `src/i18n` section.
- Add your new route inside the `src/routes/EdtRoutes.tsx` file which needs the `src/enumerations/EdtRoutesNameEnum` enumeration to be incremented as well.

You should now be able to test your development.
### Edit a label
#### Survey label
A survey label is a label that is linked to an answer of the user. Most of the time it is a question. Those labels can be found in the related survey source : `edt-activity-survey` or `edt-work-time-survey`. To edit the sources, you need to ask directly to INSEE since they are saved and managed in INSEE's information system.
Refer to the map `mappingPageOrchestrator` to find which source your page is using and the `surveyPage` property to find your `component` in the source. There you sould be able to edit the `label`.
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
```
