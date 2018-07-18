FROM ubuntu:18.04

RUN apt-get update && apt-get install -y curl gnupg2 chromium-browser

# install node & npm
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash - && apt-get update && apt-get install -yq nodejs

RUN groupadd -r pptruser \
    && useradd -r -g pptruser -G audio,video pptruser \
    && mkdir /home/pptruser \
    && chown -R pptruser:pptruser /home/pptruser

# set timezone explicitly as it is a requirment for giveaway.city's API
RUN ln -snf /usr/share/zoneinfo/America/North_Dakota/New_Salem /etc/localtime \
    && echo America/North_Dakota/New_Salem > /etc/timezone

COPY --chown=pptruser:pptruser config.js index.js package-lock.json package.json /home/pptruser/amazonianSanta/
COPY --chown=pptruser:pptruser src /home/pptruser/amazonianSanta/src/

USER pptruser
WORKDIR /home/pptruser/amazonianSanta

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
RUN npm install

ENTRYPOINT npm start