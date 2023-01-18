# **SELINA - BOOK IS LIFE**
[![N|Solid](https://firebasestorage.googleapis.com/v0/b/selina-d8690.appspot.com/o/Selina%20small.png?alt=media&token=9aeb31a4-6a94-4743-832f-6c065ca0dbdf)](https://selina-ecommerce.netlify.app/)
> ### E-commerce Website, solely for books.

---
# **_INTRODUCTION_**
- ### Project: [Selina - Book Is Life](https://selina-ecommerce.netlify.app/)
- ### Service: Profile Service - Selina
- ### Description: User Profile Management Service
- ### Source: https://github.com/ntthuan060102github/selina-profile
- ### Services Information:
    - ### Back-end: 
        - #### Authorization: https://github.com/ntthuan060102github/selina-auth
        - #### Bookshelves: https://github.com/ntthuan060102github/selina-bookshelves
        - #### Profile: https://github.com/ntthuan060102github/selina-profile
    - ### Front-end: https://github.com/ntthuan060102github/selina
- ### Full Project Source: https://github.com/ntthuan060102github/selina-origin

# **_ENVIRONMENT_**
- ### Runtime Enrironment: [Node.js] (version v16.13.2)
- ### Dev Tools: 
    - #### [Visual Studio Code]
    - #### [MongoDB Compass]
    - #### [MognoDB Shell]
    - #### [Redis Insight (v2)]
- ### Databases:
    - #### [MongoDB Cloud] (version 5.0.14)
    - #### [Redis Cloud]
- ### Storage:
    - #### [Firebase Storage]
- ### Operating System: Windows (all version)
# **_PROJECT CONFIGURATION GUIDE (LOCAL)_**
## Runtime environment
#### &nbsp; &nbsp; Selina requires [Node.js](https://nodejs.org/en/download/) v10+ to run.
## Install the Dependencies, DevDependencies and run all the Services
```
cd <path/to/source>
npm i
npm start
```
## Customize Your Environment
#### In the ***.env*** file, you can customize these follwing environment variables:
- REDIS_ENDPOINT_URI: URI to connect to your Redis cloud.
- REDIS_PASSWORD: Your redis cloud password.
- MONGO_DB_URL: URL to connect to your MongoDB cloud.
#### We wholeheartedly ***not recommended*** you to editing the remaining environment variables.
#### In the ***firebase_service_config.json*** file you can switch to your firebase configurations but you would rather not to do so as it can cause conflicts between the current data in the database and images in firebase storage.

# **_PROJECT CONFIGURATION GUIDE (RENDER.COM)_**
## Step 1: Register Render.com account 
### Register [Here](https://render.com/)
## Step 2: Clone our project to your Github
## Step 3: Access Render.com dashboard, create new Web Service
![N|Solid](https://firebasestorage.googleapis.com/v0/b/selina-d8690.appspot.com/o/Screenshot%202023-01-07%20162328.png?alt=media&token=55054d64-bda4-4f8a-9d40-5bc0727bf997)
## Step 4: Connect to your repository on Github
![N|Solid](https://firebasestorage.googleapis.com/v0/b/selina-d8690.appspot.com/o/Screenshot%202023-01-07%20162807.png?alt=media&token=9894732f-a18e-43f7-b201-ee99a4630911)
## Step 5: Fulfill your Web Service information and config commands shown as in the below picture. Before, submit it.
![N|Solid](https://firebasestorage.googleapis.com/v0/b/selina-d8690.appspot.com/o/Screenshot%202023-01-07%20163059.png?alt=media&token=39f2b8a4-1086-44c2-bbfd-ee363a6cf334)

## Step 6: In Environment tab, click "Add Environment Variable" and create 6 variables below:
```
    APP_ENV: production
    MONGO_DB_URL: <your MongoDB url>
    PORT: <any port, ex: 8800>
    REDIS_ENDPOINT_URI: <your Redis cloud endpoint>
    REDIS_PASSWORD: <your Redis cloud password>
    SECRET_KEY: selina_2a9wf5498fhm48yio64ty1j68fgn48ae48r4h
```
![N|Solid](https://firebasestorage.googleapis.com/v0/b/selina-d8690.appspot.com/o/Screenshot%202023-01-07%20163730.png?alt=media&token=e1e172e3-8396-4b4b-adbe-ad39eafa58c4)
## Finally, deploy your service.
# **_DEMO PROJECT_**
### See [here](https://www.youtube.com/watch?v=xlc2mJa0J6Q)
[![N|Solid](https://firebasestorage.googleapis.com/v0/b/selina-d8690.appspot.com/o/Screenshot%202023-01-07%20164826.png?alt=media&token=795a38fc-63b3-42b6-a82d-c2dfe219cdd6)](https://www.youtube.com/watch?v=xlc2mJa0J6Q)

# **_Current Status_**
## MVP version released.

# **_Future Work_**
## Stay tuned for upcoming update


[Visual Studio Code]: <https://code.visualstudio.com/download>
[MongoDB Compass]: <https://www.mongodb.com/products/compass>
[MognoDB Shell]: <https://www.mongodb.com/try/download/shell>
[Redis Insight (v2)]: <https://redis.io/docs/getting-started/installation/>
[MongoDB Cloud]: <https://www.mongodb.com/home>
[Redis Cloud]: <https://redis.io/>
[Node.js]: <https://nodejs.org/en/>
[Firebase Storage]: <https://console.firebase.google.com/u/0/?>