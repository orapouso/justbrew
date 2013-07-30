NODE_ENV = "development"
SHELL = /bin/bash
REPORTER = spec
TEST_PATH = test/
TEST_DEBUG =

migrate:
				./node_modules/.bin/migrate up

clean:
				[ "development" = "${NODE_ENV}" ] && rm -f ./migrations/.migrate
				rm -rf ./node_modules
				rm -rf ./log
				rm -rf ./docs/lint/* && rm -rf docs/test/xunit*
				rm -rf ./public/css

test:
			  @NODE_ENV=test ./node_modules/.bin/mocha ${TEST_DEBUG} \
			    --reporter $(REPORTER) --require should config/util.js app/models/* --recursive $(TEST_PATH)

test-docs:
				make -s test REPORTER=doc \
			    | cat docs/test/header.html - docs/test/footer.html \
			    > docs/test/test.html

jshint:
				./node_modules/.bin/jshint ./

jshint-test:
				./node_modules/.bin/jshint ./test

jshint-all: jshint-test jshint

test-jenkins:
				make -s test REPORTER=xunit | xmllint - > docs/test/xunit.xml

jshint-jenkins:
				[ -d docs/lint ] || mkdir docs/lint
				-./node_modules/.bin/jshint ./ --jslint-reporter > docs/lint/jshint.xml

jenkins: test-jenkins jshint-jenkins

.PHONY: clean migrate test test-docs test-jenkins jshint jshint-test jshint-all jshint-jenkins jenkins