import subprocess;

replacements = [['@material-ui/core','@mui/material'],
['@material-ui/unstyled','@mui/base'],
['@material-ui/icons','@mui/icons-material'],
['@material-ui/styles','@mui/styles'],
['@material-ui/system','@mui/system'],
['@material-ui/lab','@mui/lab'],
['@material-ui/types','@mui/types'],
['@material-ui/styled-engine','@mui/styled-engine'],
['@material-ui/styled-engine-sc','@mui/styled-engine-sc'],
['@material-ui/private-theming','@mui/private-theming'],
['@material-ui/codemod','@mui/codemod'],
['@material-ui/docs','@mui/docs'],
['@material-ui/envinfo','@mui/envinfo']]

for [before, after] in replacements:
  command = f"grep -rl {before} . | xargs sed -i 's|{before}|{after}|g'"
  # print(command)
  with subprocess.Popen([command], stdout=subprocess.PIPE, shell=True) as proc:
    print(proc.stdout.read())