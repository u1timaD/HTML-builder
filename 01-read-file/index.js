const { stdout, exit } = process;
import { readFile } from 'fs';
import { join } from 'path';

const dir = process.argv[1];
const asd = readFile(join(__dirname, 'text.txt'),
'utf-8',
(err, data) => {
	if (err) throw err;
	stdout.write(data);
	exit()
	}
);


