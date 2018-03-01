NODE_DOWNLOAD_URL=https://nodejs.org/dist/v8.6.0/node-v8.6.0-linux-x64.tar.gz

default: app/node

downloads/node.tar.gz:
	mkdir -p downloads
	curl https://nodejs.org/dist/v8.6.0/node-v8.6.0-linux-x64.tar.gz -o downloads/node.tar.gz

app/node: downloads/node.tar.gz
	mkdir -p app/node
	tar -C app/node --strip-components=1 -xzvf downloads/node.tar.gz
	rm -rf app/node/share app/node/include

.PHONY: default
