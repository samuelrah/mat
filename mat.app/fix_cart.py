from pathlib import Path
path = Path('src/JSX/Cart.jsx')
text = path.read_text(encoding='utf-8')
text = text.replace('className="d-flex flex-column justify-content-center align-items-center"', 'className="d-flex flex-column justify-content-center align-items-center text-center"')
text = text.replace('style={{ height: "60vh" }}', 'style={{ minHeight: "100vh" }}')
path.write_text(text, encoding='utf-8')
print('updated')
