# Vue 3 + TypeScript Boilerplate

**A modern Vue.js boilerplate with TypeScript support and essential development tools pre-configured.**

Dependencies:
- [Vue](https://vuejs.org/) the framework
- [Tailwind](https://tailwindcss.com/) for styling
- [Vue router](https://router.vuejs.org/) for routing
- [Pinia store](https://pinia.vuejs.org/) for state management



devDependencies:

- [Vite](https://vite.dev/) for bundling
- [Prettier](https://prettier.io/) for code formatting
- [Prettier-Tailwind-plugin](https://tailwindcss.com/blog/automatic-class-sorting-with-prettier) Automatic Class Sorting with Prettier
- [Eslint](https://eslint.vuejs.org/) eslint + prettier + typescript support
- [Stylelint](https://stylelint.io/) for CSS linter 

Extra 
just to make shure noone commits 💩 to git 
- [lint-staged](https://github.com/lint-staged/lint-staged) lint staged git files
- [Husky](https://typicode.github.io/husky/) lint code on git commit

## Quick Start
1. creat a new project
if not installed 
```
npm install -g degit
 ```
```
npx degit kristianDKAndersen/vite-vue-typescript-starter.git your-project-name
 ```

2. install dependencies  
```
cd your-project-name
npm install
```
3. Check for outdated dependencies (optional)
```
npm outdated 
 ```
4. Update dependencies if needed
 ```
npm update --save
```
last but not least run 
```
npm run dev
```

and remember to create a repo to push to!
```
cd your-project-name
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo-url>
git branch -M main
git push -u origin main
```