const { stdin, stdout, exit } = process;
const fs = require('fs');
const path = require('path');

const dir = process.argv[1];
const asd = fs.readFile(path.join(__dirname, 'text.txt'),
'utf-8',
(err, data) => {
	if (err) throw err;
	stdout.write(data);
	exit()
	}
)



