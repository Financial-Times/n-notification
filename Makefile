include n.Makefile

build: clean
	obt build --js=./src/main.js --sass=./src/main.scss --buildFolder=./

clean:
	rm -f ./main.*;

test: verify
	./node_modules/karma/bin/karma start --single-run

demo:
	obt demo --local --watch
