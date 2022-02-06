import numbers
import os
import re

index_num = 12  

original_text = """
a,
a.visited {
	color: inherit;
	text-decoration: underline;
}
"""
input_text = """
a,
a.visited {
	color: inherit;
	text-decoration: none;
}
"""

script = '<script src="../embed-sub.js" defer></script><link rel="stylesheet" href="../notion-mainstyle.css" />'
second_script = '<script src="../../embed-sub.js" defer></script><link rel="stylesheet" href="../../notion-mainstyle.css" />'
scripts = 'hi'


def insert_script_to_firstLine(file_name, script_text):
    with open(file_name, 'r') as html_file:
        first_line = list(html_file.readline())
        first_line.insert(index_num, script_text)
        completed_line = ''.join(first_line)
        replace_line(file_name, 0, completed_line)
    


def replace_line(file_name, line_num, text):
    lines = open(file_name, 'r').readlines()
    lines[line_num] = text
    out = open(file_name, 'w')
    out.writelines(lines)
    out.close()


def replace_paragraph(file_name, original_text, input_text):
    data = open(file_name, 'r').read()
    updated_data = re.sub(original_text, input_text, data)
    with open(file_name, 'w') as out:
        out.write(updated_data)
    


def read_first_line(file_name):
    with open(file_name) as html_file:
            first_line = html_file.readline()
            return first_line

for f_name in os.listdir('🐍 dfd82f66284b4f8ca44c5f5f3b6e544a'):
    if f_name.endswith('html'):
        first_line = read_first_line('./🐍 dfd82f66284b4f8ca44c5f5f3b6e544a/' + f_name)
        if script in first_line:
            print(first_line+"에는 " + script + "가 있습니다")
        else:
            insert_script_to_firstLine('./🐍 dfd82f66284b4f8ca44c5f5f3b6e544a/' + f_name, script)
        replace_paragraph('./🐍 dfd82f66284b4f8ca44c5f5f3b6e544a/' + f_name, original_text, input_text)
        
for f_name in os.listdir('🐍 dfd82f66284b4f8ca44c5f5f3b6e544a/History d23d460f2e554944bf60448e47f982ef'):
    if f_name.endswith('html'):
        first_line = read_first_line('./🐍 dfd82f66284b4f8ca44c5f5f3b6e544a/History d23d460f2e554944bf60448e47f982ef/' + f_name)
        if second_script in first_line:
            print(first_line+"에는 " + second_script + "가 있습니다")
        else:
            insert_script_to_firstLine('./🐍 dfd82f66284b4f8ca44c5f5f3b6e544a/History d23d460f2e554944bf60448e47f982ef/' + f_name, second_script)
        replace_paragraph('./🐍 dfd82f66284b4f8ca44c5f5f3b6e544a/History d23d460f2e554944bf60448e47f982ef/' + f_name, original_text, input_text)
