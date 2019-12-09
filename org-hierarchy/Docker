FROM node:7
RUN mkdir /org-hierarchy
ADD . /org-hierarchy
WORKDIR /org-hierarchy
RUN npm i
EXPOSE 80
CMD ["npm", "start"]