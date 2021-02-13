call cls
call tsc >errors.txt
call ren *.json *.tson
call ren frontend/*.js *.compiledts
call del *.js /S/Q 
call ren *.tson *.json 
rem call ren frontend/*.compiledts *.js
