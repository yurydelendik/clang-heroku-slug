default: app/clang

tmp/wasmception-linux-bin: precomp/wasmception-linux-bin.tar.gz
	mkdir -p tmp/wasmception-linux-bin
	tar -C tmp/wasmception-linux-bin -xvf precomp/wasmception-linux-bin.tar.gz

app/clang: tmp/wasmception-linux-bin
	cp -R tmp/wasmception-linux-bin/dist app/clang
	cp -R tmp/wasmception-linux-bin/sysroot app/sysroot
