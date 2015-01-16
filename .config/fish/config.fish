set -gx TERM xterm-256color

set fish_function_path $fish_function_path "/usr/lib/python3.4/site-packages/powerline/bindings/fish"
powerline-setup

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

#if status --is-login
#    set PPID (echo (ps --pid %self -o ppid --no-headers) | xargs)
#    if ps --pid $PPID | grep ssh
#        tmux has-session -t remote; and tmux attach-session -t remote; or tmux new-session -s remote; and kill %self
#        echo "tmux failed to start; using plain fish shell"
#    end
#end

alias git=hub

set -gx PATH $HOME/bin $HOME/mfbin /usr/local/bin $PATH

if test -z $CRD
    set -Ux CRD $HOME
end

function setcrd
    set -Ux CRD "$argv"
end

function getcrd
    echo $CRD
end

function vf
    vim $HOME/.config/fish/config.fish
end

function reload
    source $HOME/.config/fish/config.fish
end

#if status --is-login
#    if test -z "$DISPLAY" -a $XDG_VTNR = 1
#        exec startx
#    end
#end

function tmux_new
    tmux new
    #and kill %self
end

function tmux_attach
    tmux has -t 0
    and tmux new -t 0
end

if test -z $TMUX
    tmux_attach
    or tmux_new
    or echo "tmux failed to start; using plain fish shell"
#else
#    echo "tmux is already running according to \$TMUX: $TMUX"
end
