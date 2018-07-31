. ~/.config/fish/.promptline.fish
bind '[1~' beginning-of-line
bind '[4~' end-of-line

############
# ENV VARS #
############

source $HOME/mfbin/load_env.fish
set -gx GITLAB_TOKEN o7zayd6zq6bEus2Bc97V
set -gx EDITOR vim
set -gx NODE_PATH /usr/lib/node_modules
set -gx TERM xterm-256color
set -gx MANPATH $HOME/.linuxbrew/share/man $MANPATH
set -gx INFOPATH $HOME/.linuxbrew/share/info $INFOPATH

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


set -l prepend $HOME/bin /usr/local/bin ./node_modules/.bin $HOME/.yarn/bin $HOME/.linuxbrew/bin
set -l append /usr/bin/core_perl $HOME/mfbin $HOME/.config/composer/vendor/bin

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

###########
# Aliases #
###########

alias ls="ls --color=auto --indicator-style=classify --block-size=M -h"
alias open="xdg-open"
alias art="$HOME/myfarms/site/artisan"
alias del=/bin/rm
alias dc=docker-compose
alias svim="sudo -E vim"

####################
# Useful Functions #
####################

function dusk
  env HEADLESS=false $HOME/myfarms/api/artisan dusk $argv
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

# Enables a sort of "trash" functionaility to your rm command
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

################################
# CRD (Current Root Directory) #
################################

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

# Adds one additional change to the default cd function which allows cd to $CRD
function cd --description 'Change directory relative to root'
	# Skip history in subshells
	if status --is-command-substitution
		builtin cd $argv
		return $status
	end

	# Avoid set completions
	set -l previous $PWD

	if test $argv[1] = - ^/dev/null
		if test "$__fish_cd_direction" = next ^/dev/null
			nextd
		else
			prevd
		end
		return $status
	end

  if test -z $argv[1]
      builtin cd $CRD
  else
      builtin cd $argv[1]
  end
	set -l cd_status $status

	if test $cd_status = 0 -a "$PWD" != "$previous"
		set -g dirprev $dirprev $previous
		set -e dirnext
		set -g __fish_cd_direction prev
	end

	return $cd_status
end

# Completion for the `tma` command
#if status -i
#    complete -x --authoritative --command tma --arguments (tma --_completion (commandline -cp))
#end
