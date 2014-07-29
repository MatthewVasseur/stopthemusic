function display(r, num, type, text) {
  r.writeHead(num, {"Content-Type": type});
  r.write(text);
  r.end();
}

exports.display = display;