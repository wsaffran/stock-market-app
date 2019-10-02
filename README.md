# stock-market-app
A web-based stock portfolio application.

## Project Status
This project is currently in development.


## Installation and Setup Instructions  

Clone down this repository. You will need `node` and `npm` installed globally on your machine.  

Installation:

`npm install`  

To Start Server:

`npm start` 

To Start Client:

`npm start`

To Visit App:

`localhost:3000/`  

## Reflection

  - Full Stack assignment for stage II of Oscar’s NYC Apprenticeship Program's assessment process
  - I set out to create an API and user interface for a stock porfolio simulator. The goal was to meet certain requirements:
  - 1.As a user, I want to create a new account with my name,email, and passwordso that I can buy and trade stocks.
  - 2.As a user, I want to authenticate via email and password so that I can access my account.
  - 3.As a user, I want to buy shares of stock at its current price by specifying its ticker symbol and the number of sharesso that I can invest.
  - 4.As a user, I want to view a list of all transactions I’ve made to date (trades) so that I can perform an audit.
  - 5.As a user, I want to view my portfolio (a list of all the stocks I ownalong with their current values) so that I can review performance.
  - 6.As a user, I’d like to see the font color of stock symbols and current prices inmy portfolio change dynamically to indicate performance.
  - Why was this project challenging and therefore a really good learning experience?
  - What were some unexpected obstacles?
  - What tools did you use to implement this project?
      - This might seem obvious because you are IN this codebase, but to all other humans now is the time to talk about why you chose webpack instead of create react app, or D3, or vanilla JS instead of a framework etc. Brag about your choices and justify them here.  

#### Example:  

This was a 3 week long project built during my third module at Turing School of Software and Design. Project goals included using technologies learned up until this point and familiarizing myself with documentation for new features.  

Originally I wanted to build an application that allowed users to pull data from the Twitter API based on what they were interested in, such as 'most tagged users'. I started this process by using the `create-react-app` boilerplate, then adding `react-router-4.0` and `redux`.  

One of the main challenges I ran into was Authentication. This lead me to spend a few days on a research spike into OAuth, Auth0, and two-factor authentication using Firebase or other third parties. Due to project time constraints, I had to table authentication and focus more on data visualization from parts of the API that weren't restricted to authenticated users.

At the end of the day, the technologies implemented in this project are React, React-Router 4.0, Redux, LoDash, D3, and a significant amount of VanillaJS, JSX, and CSS. I chose to use the `create-react-app` boilerplate to minimize initial setup and invest more time in diving into weird technological rabbit holes. In the next iteration I plan on handrolling a `webpack.config.js` file to more fully understand the build process.
