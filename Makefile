LIBS=lib/jstorage.min.js lib/knockout-2.3.0.js lib/normalize.css
LIBS_OUT=$(LIBS:lib/%=bin/%)

all: bin/index.html

bin/index.html: src/index.html bin/ks.css bin/ks.js $(LIBS_OUT)
	cp src/index.html bin/

bin/ks.css:	src/ks.css
	cp src/ks.css bin/

bin/ks.js:	src/ks.js
	./jsmin/jsmin <src/ks.js >bin/ks.js

$(LIBS_OUT): $(LIBS)
	cp $? bin/

clean:
	rm bin/*
