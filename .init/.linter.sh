#!/bin/bash
cd /home/kavia/workspace/code-generation/simple-task-manager-141032-141068/todo_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

