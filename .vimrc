" Use Vim settings, rather than Vi settings (much better!).
" This must be first, because it changes other options as a side effect.
set nocompatible
filetype off

"let &t_SI = "\<Esc>Ptmux;\<Esc>\<Esc>]50;CursorShape=1\x7\<Esc>\\"
"let &t_SR = "\<Esc>Ptmux;\<Esc>\<Esc>]50;CursorShape=2\x7\<Esc>\\"
"let &t_EI = "\<Esc>Ptmux;\<Esc>\<Esc>]50;CursorShape=0\x7\<Esc>\\"
" Cursors
let &t_SI = "\<Esc>[6 q"
let &t_SR = "\<Esc>[4 q"
let &t_EI = "\<Esc>[2 q"

" git clone https://github.com/VundleVim/Vundle.vim.git ~/.vim/bundle/Vundle.vim
set rtp+=~/.vim/bundle/Vundle.vim
call vundle#begin()

Plugin 'VundleVim/Vundle.vim'
Plugin 'tpope/vim-sensible'
"Plugin 'kchmck/vim-coffee-script'
Plugin 'vim-airline/vim-airline'
Plugin 'vim-airline/vim-airline-themes'
Plugin 'pangloss/vim-javascript'
Plugin 'groenewege/vim-less'
"Plugin 'digitaltoad/vim-jade'
Plugin 'wavded/vim-stylus'
Plugin 'leafgarland/typescript-vim'
Plugin 'wincent/Command-T'
Plugin 'christoomey/vim-tmux-navigator'
Plugin 'posva/vim-vue'
Plugin 'dag/vim-fish'

call vundle#end()


"let &t_SI = "\<Esc>[6 q"
"let &t_SR = "\<Esc>[4 q"
"let &t_EI = "\<Esc>[2 q"


colo gruvbox
set visualbell
set t_vb=
if &term =~ '256color'
    " disable Background Color Erase (BCE) so that color schemes
    " render propertly when inside 256-color tmux and GNU screen.
    " see also http://snk.tuxfamily.org/log/vim-256color-bce.html
    set t_ut=
endif

nmap ,h  :wa<cr>:execute '!set_current_test'.expand('%:p').' '.line('.')<cr><cr>
nmap  :wa<cr>:execute '!run_current_test'<cr><cr>

let g:tmux_navigator_no_mappings = 1
nnoremap <silent> <C-w>h :TmuxNavigateLeft<cr>
nnoremap <silent> <C-w>j :TmuxNavigateDown<cr>
nnoremap <silent> <C-w>k :TmuxNavigateUp<cr>
nnoremap <silent> <C-w>l :TmuxNavigateRight<cr>

au BufNewFile,BufRead *.ejs set filetype=html
au BufNewFile,BufReadPost *.js setl shiftwidth=2 expandtab tabstop=2 softtabstop=2
au BufNewFile,BufReadPost *.coffee setl shiftwidth=2 expandtab tabstop=2 softtabstop=2
"au BufNewFile,BufReadPost *.ts setl shiftwidth=4 expandtab tabstop=4 softtabstop=4
au BufNewFile,BufReadPost *.jade setl shiftwidth=2 expandtab tabstop=2 softtabstop=2
au BufRead,BufNewFile *.cson set ft=coffee
"set rtp+=/usr/local/lib/python3.4/site-packages/powerline/vim/
"python3 from powerline.vim import setup as powerline_setup
"python3 powerline_setup()
"python3 del powerline_setup
let g:airline_powerline_fonts = 1
let g:airline_theme = 'wombat'
set laststatus=2
set esckeys
set scrolloff=1
set splitright
set splitbelow
set shell=/bin/bash

" Solarized settings
set bg=dark
"colorscheme solarized
set t_Co=256
"colorscheme xoria256noback

set autochdir

set undofile
silent !mkdir ~/.vim/undo > /dev/null 2>&1
set undodir=~/.vim/undo
silent !mkdir ~/.vim/swap > /dev/null 2>&1
set directory=~/.vim/swap
silent !mkdir ~/.vim/backup > /dev/null 2>&1
set backupdir=~/.vim/backup

"set spell spelllang=en_us
set tabstop=2
set softtabstop=2
set shiftwidth=2
set nu
set et
set wildmenu
set wildmode=full
let g:is_bash=1
set ai
set timeoutlen=250
set ignorecase
set smartcase

let g:syntastic_c_include_dirs = [ '~/usr/local/include' ]

let python_highlight_all = 1

if $COLORTERM == 'gnome-terminal' || $TERM == 'xterm-256color' || $TERM == 'rxvt-unicode-256color'
    "set t_Co=256
    set t_ut=
else
    "set t_Co=8
endif

au BufRead,BufNewFile *.md set filetype=markdown
autocmd FileType markdown setlocal textwidth=80
let g:vim_markdown_initial_foldlevel=1

nnoremap  I// <esc>j
"nnoremap  :!run % ~/usr/local/lib/libfuzzylite.so<CR>
"nnoremap  :!run_python %<CR>
nnoremap "" :w<CR>

" UDLR
"noremap ; l
"noremap l h
"noremap k j
"noremap j k

" LUDR
"noremap ; l
"noremap l k
"noremap k j
"noremap j h
"
"noremap <C-w>; <C-w>l
"noremap <C-w>l <C-w>k
"noremap <C-w>k <C-w>j
"noremap <C-w>j <C-w>h
"
"noremap <C-w>: <C-w>L
"noremap <C-w>L <C-w>K
"noremap <C-w>K <C-w>J
"noremap <C-w>J <C-w>H

noremap <F7> :set invspell spelllang=en_us<BAR>set spell?<CR>

"let g:CSApprox_attr_map = { 'bold' : 'bold', 'italic' : '', 'sp' : ''}

nmap <C-S-P> :call <SID>SynStack()<CR>

function! <SID>SynStack()
    if !exists("*synstack")
        return
    endif
    echo map(synstack(line('.'), col('.')), 'synIDattr(v:val, "name")')
endfunc

nnoremap <C-L> <esc>:noh<return>

"map gC :'a,. s/^/ */^M:. s/\(.*\)/\1^V^V^M **************\//^M:'a s/\(.*\)/\/**************^V^V^M\1/^M

au BufRead,BufNewFile *bash* let g:is_bash=1
au BufRead,BufNewFile *bash* setf sh

autocmd! BufNewFile * silent! 0r ~/.vim/skel/tmpl.%:e

" set t_Co=88

" An example for a vimrc file.
"
" Maintainer:	Bram Moolenaar <Bram@vim.org>
" Last change:	2008 Dec 17
"
" To use it, copy it to
"     for Unix and OS/2:  ~/.vimrc
"	      for Amiga:  s:.vimrc
"  for MS-DOS and Win32:  $VIM\_vimrc
"	    for OpenVMS:  sys$login:.vimrc

" When started as "evim", evim.vim will already have done these settings.
if v:progname =~? "evim"
    finish
endif

" allow backspacing over everything in insert mode
set backspace=indent,eol,start

if has("vms")
    set nobackup		" do not keep a backup file, use versions instead
else
    set backup		" keep a backup file
endif
set history=50		" keep 50 lines of command line history
set ruler		" show the cursor position all the time
set showcmd		" display incomplete commands
set incsearch		" do incremental searching

" For Win32 GUI: remove 't' flag from 'guioptions': no tearoff menu entries
" let &guioptions = substitute(&guioptions, "t", "", "g")

" Don't use Ex mode, use Q for formatting
map Q gq

" CTRL-U in insert mode deletes a lot.  Use CTRL-G u to first break undo,
" so that you can undo CTRL-U after inserting a line break.
inoremap <C-U> <C-G>u<C-U>

" In many terminal emulators the mouse works just fine, thus enable it.
if has('mouse')
    set mouse=a
endif

if !has('nvim')
  if has('mouse_sgr')
      set ttymouse=sgr
  else
      set ttymouse=xterm2
  endif
endif

" Switch syntax highlighting on, when the terminal has colors
" Also switch on highlighting the last used search pattern.
if &t_Co > 2 || has("gui_running")
    syntax on
    set hlsearch
endif

" Only do this part when compiled with support for autocommands.
if has("autocmd")

    " Enable file type detection.
    " Use the default filetype settings, so that mail gets 'tw' set to 72,
    " 'cindent' is on in C files, etc.
    " Also load indent files, to automatically do language-dependent indenting.
    filetype plugin indent on

    " Put these in an autocmd group, so that we can delete them easily.
    augroup vimrcEx
        au!

        " For all text files set 'textwidth' to 78 characters.
        autocmd FileType text setlocal textwidth=78

        " When editing a file, always jump to the last known cursor position.
        " Don't do it when the position is invalid or when inside an event handler
        " (happens when dropping a file on gvim).
        " Also don't do it when the mark is in the first line, that is the default
        " position when opening a file.
        autocmd BufReadPost *
                    \ if line("'\"") > 1 && line("'\"") <= line("$") |
                    \   exe "normal! g`\"" |
                    \ endif

    augroup END

else

    set autoindent		" always set autoindenting on

endif " has("autocmd")

" Convenient command to see the difference between the current buffer and the
" file it was loaded from, thus the changes you made.
" Only define it when not defined already.
if !exists(":DiffOrig")
    command DiffOrig vert new | set bt=nofile | r # | 0d_ | diffthis
                \ | wincmd p | diffthis
endif


function SmoothScroll(up)
    if a:up
        let scrollaction=""
    else
        let scrollaction=""
    endif
    exec "normal " . scrollaction
    redraw
    let counter=1
    while counter<&scroll
        let counter+=1
        sleep 10m
        redraw
        exec "normal " . scrollaction
    endwhile
endfunction

nnoremap <C-U> :call SmoothScroll(1)<Enter>
nnoremap <C-D> :call SmoothScroll(0)<Enter>
inoremap <C-U> <Esc>:call SmoothScroll(1)<Enter>i
inoremap <C-D> <Esc>:call SmoothScroll(0)<Enter>i

map <ScrollWheelUp> <C-Y>
map <ScrollWheelDown> <C-E>
set iskeyword-=_
set iskeyword-=/
