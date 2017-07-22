# mountaintrackapps.com

This is a static site deployed to an S3 bucket.

## Hosting

### Staging

<http://mountaintrackappsstaging.s3-website-us-east-1.amazonaws.com/>

### Production

<http://mountaintrackapps.com>

## Installation

1. Clone repository to the dev machine.

2. Install `npm` if not already installed. See the [offical install docs.](http://www.joyent.com/blog/installing-node-and-npm/).

3. [Grunt](<http://gruntjs.com/getting-started>) command line tools are used to run tasks. Install them by:

    ````sh
    $ npm install grunt-cli -g
    ````

4. Navigate to the project folder which has `Gruntfile.coffee` and `package.json`

5. Install all the project dependencies

    ````sh
    $ npm install
    ````

## Run locally

````sh
$ grunt build_watch
````

then

````sh
$ grunt preview
````

then browse to <http://localhost:8000>


## Publish to S3

````sh
$ grunt build_deploy
````

or

````sh
$ grunt build_deploy:production
````
