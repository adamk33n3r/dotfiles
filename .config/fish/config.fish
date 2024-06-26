. ~/.config/fish/.promptline.fish
bind '[1~' beginning-of-line
bind '[4~' end-of-line

############
# ENV VARS #
############

set -gx CURL_CA_BUNDLE ~/winhome/.ao_ssl/ca-bundle.crt
set -gx GITLAB_TOKEN o7zayd6zq6bEus2Bc97V
set -gx EDITOR vim
set -gx NODE_PATH /usr/lib/node_modules
set -gx NODE_ENV local
set -gx TERM xterm-256color
set -gx SHELL /usr/bin/fish
set -gx MANPATH $HOME/.linuxbrew/share/man /usr/share/man $MANPATH
set -gx INFOPATH $HOME/.linuxbrew/share/info $INFOPATH
#set -gx LS_COLORS "di=1:ln=35:so=32:pi=33:ex=31:bd=34;46:cd=34;43:su=30;41:sg=30;46:tw=30;42:ow=30;43"
#set -gx LS_COLORS "di=1;32:ln=35:so=32:pi=33:ex=31:bd=34;46:cd=34;43:su=30;41:sg=30;46:tw=30;42:ow=1;32"
set -gx LS_COLORS "rs=0:di=01;34:ln=01;36:mh=00:pi=40;33:so=01;35:do=01;35:bd=40;33;01:cd=40;33;01:or=40;31;01:mi=00:su=37;41:sg=30;43:ca=30;41:tw=30;42:ow=1;34:st=37;44:ex=01;32:*.tar=01;31:*.tgz=01;31:*.arc=01;31:*.arj=01;31:*.taz=01;31:*.lha=01;31:*.lz4=01;31:*.lzh=01;31:*.lzma=01;31:*.tlz=01;31:*.txz=01;31:*.tzo=01;31:*.t7z=01;31:*.zip=01;31:*.z=01;31:*.Z=01;31:*.dz=01;31:*.gz=01;31:*.lrz=01;31:*.lz=01;31:*.lzo=01;31:*.xz=01;31:*.zst=01;31:*.tzst=01;31:*.bz2=01;31:*.bz=01;31:*.tbz=01;31:*.tbz2=01;31:*.tz=01;31:*.deb=01;31:*.rpm=01;31:*.jar=01;31:*.war=01;31:*.ear=01;31:*.sar=01;31:*.rar=01;31:*.alz=01;31:*.ace=01;31:*.zoo=01;31:*.cpio=01;31:*.7z=01;31:*.rz=01;31:*.cab=01;31:*.wim=01;31:*.swm=01;31:*.dwm=01;31:*.esd=01;31:*.jpg=01;35:*.jpeg=01;35:*.mjpg=01;35:*.mjpeg=01;35:*.gif=01;35:*.bmp=01;35:*.pbm=01;35:*.pgm=01;35:*.ppm=01;35:*.tga=01;35:*.xbm=01;35:*.xpm=01;35:*.tif=01;35:*.tiff=01;35:*.png=01;35:*.svg=01;35:*.svgz=01;35:*.mng=01;35:*.pcx=01;35:*.mov=01;35:*.mpg=01;35:*.mpeg=01;35:*.m2v=01;35:*.mkv=01;35:*.webm=01;35:*.ogm=01;35:*.mp4=01;35:*.m4v=01;35:*.mp4v=01;35:*.vob=01;35:*.qt=01;35:*.nuv=01;35:*.wmv=01;35:*.asf=01;35:*.rm=01;35:*.rmvb=01;35:*.flc=01;35:*.avi=01;35:*.fli=01;35:*.flv=01;35:*.gl=01;35:*.dl=01;35:*.xcf=01;35:*.xwd=01;35:*.yuv=01;35:*.cgm=01;35:*.emf=01;35:*.ogv=01;35:*.ogx=01;35:*.aac=00;36:*.au=00;36:*.flac=00;36:*.m4a=00;36:*.mid=00;36:*.midi=00;36:*.mka=00;36:*.mp3=00;36:*.mpc=00;36:*.ogg=00;36:*.ra=00;36:*.wav=00;36:*.oga=00;36:*.opus=00;36:*.spx=00;36:*.xspf=00;36:"

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


set -l prepend $HOME/bin /usr/local/bin ./node_modules/.bin $HOME/.yarn/bin $HOME/.node_modules/bin #$HOME/.linuxbrew/bin
set -l append $HOME/.composer/vendor/bin ~/.local/bin #/usr/bin/core_perl

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
#alias open="xdg-open"
alias del=/bin/rm
alias dc=docker-compose
alias svim="sudo -E vim"
alias emsdk_setup=". ~/projects/emsdk/emsdk_env.fish"

####################
# Useful Functions #
####################

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

	#if test $argv[1] = - ^/dev/null
	#	if test "$__fish_cd_direction" = next ^/dev/null
	#		nextd
	#	else
	#		prevd
	#	end
	#	return $status
	#end

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


if status -l
  #~/start-services.sh
  cd
end
