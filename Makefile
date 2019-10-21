build: node_modules
	npm run build && tar czf dist.tgz dist node_modules

node_modules:
	npm install

install: node_modules

clean:
	rm -rf node_modules
	rm -rf dist
	rm -rf dist.tgz

docker: node_modules
	docker build -t node-event .
