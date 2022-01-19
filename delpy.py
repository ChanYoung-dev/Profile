import os

script = '<script src="../embed-sub.js" defer></script><link rel="stylesheet" href="notion-mainstyle.css" />'



def replace_line(file_name, line_num, text):
    lines = open(file_name, 'r').readlines()
    lines[line_num] = text
    out = open(file_name, 'w')
    out.writelines(lines)
    out.close()


for f_name in os.listdir('hellodev d23d460f2e554944bf60448e47f982ef'):
    if f_name.endswith('html'):
        html_file = open('./hellodev d23d460f2e554944bf60448e47f982ef/' + f_name, 'r')
        line = html_file.readline()
        print(line)
        if script in line:
            continue
        lines=list(line)
        lines.insert(12, script)
        lines = ''.join(lines)
        replace_line('./hellodev d23d460f2e554944bf60448e47f982ef/' + f_name, 0, lines)
        html_file.close()
