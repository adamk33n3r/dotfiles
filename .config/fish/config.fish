#set -g powerline /usr/lib/python3.6/site-packages/powerline

#set fish_function_path $fish_function_path "/usr/lib/python2.7/site-packages/powerline/bindings/fish"
#powerline-setup
# from https://gist.github.com/mamiu/87df7050dccaf2c890dd
. ~/.config/fish/.promptline.fish

set -g topleft (printf '\u250c')
set -g bottomleft (printf '\u2514')
set -g horiz (printf '\u2500')
set -g arrow (printf '\u27a2')
set -g skullxbones (printf '\u2620')
set -g snowman (printf '\u2603')

set -g fish_color_autosuggestion white
set -g fish_color_command -o green
set -g fish_color_comment red
set -g fish_color_cwd green
#set -g fish_color_cwd_root red
set -g fish_color_error '-o' 'red'
set -g fish_color_escape cyan
set -g fish_color_history_current cyan
set -g fish_color_host '-o' 'cyan'
set -g fish_color_match cyan
set -g fish_color_normal normal
set -g fish_color_operator -o yellow
set -g fish_color_param -o yellow
set -g fish_color_quote brown
set -g fish_color_redirection normal
set -g fish_color_search_match purple
set -g fish_color_status red 
set -g fish_greeting


# fish git prompt
set __fish_git_prompt_show_informative_status
set ___fish_git_prompt_char_stateseparator '|'
set __fish_git_prompt_showdirtystate 'yes'
set __fish_git_prompt_showstashstate 'yes'
set __fish_git_prompt_showupstream 'yes'
set __fish_git_prompt_color_branch -o yellow
set __fish_git_prompt_color green

# Status Chars
set __fish_git_prompt_char_dirtystate '⚡'
set __fish_git_prompt_char_stagedstate '→'
set __fish_git_prompt_char_stashstate '↩'
set __fish_git_prompt_char_upstream_ahead '↑'
set __fish_git_prompt_char_upstream_behind '↓'

bind '[1~' beginning-of-line
bind '[4~' end-of-line

#if status --is-login
#    set PPID (echo (ps --pid %self -o ppid --no-headers) | xargs)
#    if ps --pid $PPID | grep ssh
#        tmux has-session -t remote; and tmux attach-session -t remote; or tmux new-session -s remote; and kill %self
#        echo "tmux failed to start; using plain fish shell"
#    end
#end

function rm
    if not count $argv > /dev/null
      echo 'No args supplied'
      return
    end
    if test $argv[1] = '-r'
      echo 'use del'
      return
    end
    if test $argv[1] = '-f'
      set argv $argv[2..-1]
    end
    for file in $argv
      if not test -e $file
        echo "rm: cannot remove '$file': No such file"
        continue
      end
      set fileName (basename -- "$file")
      set dir ~/.trash/$fileName
      set date (date -Iseconds)
      set dest "$dir/$fileName~$date"
      mkdir -p "$dir"
      mv --backup=numbered "$file" "$dest"
    end
end

set -x EDITOR vim

source $HOME/mfbin/load_env.fish

alias git=hub
#alias rm=trash
alias del=/bin/rm
#alias python=ipython
alias vless="/bin/sh /usr/share/vim/vim74/macros/less.sh"
alias ls="ls --color=auto --indicator-style=classify --block-size=M -h"
alias open="xdg-open"
alias py2="vf activate py2"
alias py3="vf activate py3"
alias art="$HOME/myfarms/site/artisan"
alias py="ipython"
alias dc=docker-compose

function dusk
  env HEADLESS=false $HOME/myfarms/api/artisan dusk $argv
end

set -l prepend $HOME/bin /usr/local/bin ./node_modules/.bin $HOME/.yarn/bin
set -l append /usr/bin/core_perl $HOME/mfbin $HOME/.composer/vendor/bin

for path in $prepend
  if not contains $path $PATH
    set PATH $path $PATH
  end
end

for path in $append
  if not contains $path $PATH
    set PATH $PATH $path
  end
end

set -x NODE_PATH /usr/lib/node_modules
set -x ANDROID_HOME /opt/android-sdk

if test -z $CRD
    set -x CRD $HOME
end

function setcrd
    set -eg CRD
    if test -z $argv
        set -x CRD (pwd)
    else
        set -x CRD "$argv"
    end
end

function getcrd
    echo -n $CRD
end

function vimf
    vim $HOME/.config/fish/config.fish
    reload
end

function reload
    source $HOME/.config/fish/config.fish
end

function loop --description 'Perform command after <enter>'
    eval $argv
    while read
        eval $argv
    end
end

function loopi --description 'Perform command every n seconds'
    set -l i $argv[1]
    set -l cmd $argv[2..-1]
    while true
      eval $cmd
      echo
      sleep $i
    end
end

#if status --is-login
#    if test -z "$DISPLAY" -a $XDG_VTNR = 1
#        exec startx
#    end
#end

if status -i
    complete -x -c tma -a (tma --_completion (commandline -cp))
    complete -c git -n '__fish_git_using_command co' -a '(__fish_git_ranges)' -d 'Branch'
end

function tmux_new
    tmux new
    #and kill %self
end

function tmux_attach
    tmux attach
    #tmux has -t 0
    #and tmux new -t 0
end

set -g VIRTUALFISH_COMPAT_ALIASES "hi"
source /usr/share/virtualfish/auto_activation.fish
source /usr/share/virtualfish/global_requirements.fish
source /usr/share/virtualfish/virtual.fish

set -x TERM xterm-256color
exit

if not status -l; and test -z $TMUX
    set -x TERM xterm-256color
    tmux_attach
    or tmux_new
#    or echo "tmux failed to start; using plain fish shell"
#else
#    echo "tmux is already running according to \$TMUX: $TMUX"
end

rvm default
