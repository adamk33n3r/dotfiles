Vim�UnDo� lc�����i������O�g�VB�|sE�<d`�                                      T�?    _�                             ����                                                                                                                                                                                                                                                                                                                                                             T�     �                   5�_�                            ����                                                                                                                                                                                                                                                                                                                                                             T�"     �               5�_�                            ����                                                                                                                                                                                                                                                                                                                                                             T�'     �               5�_�                            ����                                                                                                                                                                                                                                                                                                                                       
           V        T�,     �             	   #   # ~/.bashrc   #       1# If not running interactively, don't do anything   [[ $- != *i* ]] && return   5#test -z "$TMUX" && (tmux attach || tmux new-session)       alias ls='ls --color=auto'5�_�                            ����                                                                                                                                                                                                                                                                                                                                       <           V        T�/    �             :       export MF_DIR=$HOME/myfarms   'export PATH=$HOME/bin:$HOME/mfbin:$PATH       source ~/mfbin/load_env.sh           TERM=xterm-256color   source ~/.bashrc_default   E# To the extent possible under law, the author(s) have dedicated all    G# copyright and related and neighboring rights to this software to the    N# public domain worldwide. This software is distributed without any warranty.        #LANG="en_US.utf8"   #LANGUAGE="en_US.utf8"   #LC_ALL="en_US.utf8"       rm() {   "    mkdir -p ~/.trash/`dirname $@`   3    mv --backup=numbered "$@" ~/.trash/`dirname $@`   }       del() {       /bin/rm "$@"   }       source ~/.lscolorsrc   -if [ "$COLORTERM" == "gnome-terminal" ]; then       export TERM=xterm-256color   fi       (alias rcssserver='cd ~/temp; rcssserver'   *alias rcsoccersim='cd ~/temp; rcsoccersim'       2alias ls='ls -h --color --group-directories-first'   alias cls='clear'   alias cl='cls'   alias sshh='ssh akeenan@matt'   <alias sshserver='ssh adamk33n3r@mediaserver.adam-keenan.net'   2alias sshvbox='ssh adam@webserver.adam-keenan.net'   "alias open='xdg-open &> /dev/null'       alias df='df -h'   alias du='du -h'   alias ll='ls -Al'   alias la='ls -A'       export LANG=en_US.utf8   source ~/.bash_colors   source ~/.bash_themes   source ~/.bash_git   case $- in *i*) my_theme; esac       source ~/.git-completion.bash       shopt -s dotglob   set -o ignoreeof   shopt -s cdspell5�_�                             ����                                                                                                                                                                                                                                                                                                                                                             T�>    �                  5��