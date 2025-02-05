# How to run

in order to run the ci workflow you need to :
You must have the gh cli install locally

1. add temporary an event in the ci.yml
   on: workflow_dispatch

2. then in your shell and with the gh cli yould could run this command:

```shell
gh workflow run ci.yml --ref name_of_your_branch
```


