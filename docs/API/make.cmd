@echo off

echo You might need to install raml2html, npm i -g raml2html
echo.
if not exist ".\pages" mkdir pages
FOR /D /r %%G in ("*") DO  call :makehtml %%~nxG

echo.
echo Done

:makehtml
    set "folder=%1"

    if not "%folder%" == "pages" (
        if not "%folder%" == "" (
            echo building %folder%.html from %folder%.raml...
            raml2html ./%folder%/%folder%.raml > ./pages/%folder%.html
        )
    )

