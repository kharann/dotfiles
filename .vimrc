set nocompatible
filetype off

call plug#begin()

" Styling
Plug 'kien/rainbow_parentheses.vim'
Plug 'morhetz/gruvbox'
Plug 'vim-airline/vim-airline'
Plug 'vim-airline/vim-airline-themes'

" CSS
Plug 'noscripter/vim-coloresque', { 'for': ['css', 'scss', 'sass'] }

" Improvements to VIm
Plug 'tpope/vim-repeat'
Plug 'tpope/vim-surround'
Plug 'tpope/vim-commentary'
Plug 'mattn/emmet-vim'
Plug 'Valloric/ListToggle'
Plug 'tpope/vim-fugitive'
Plug 'kana/vim-textobj-user'
Plug 'w0rp/ale'
Plug 'tpope/vim-endwise'
Plug 'rhysd/clever-f.vim'
Plug 'rhysd/committia.vim'
Plug 'ctrlpvim/ctrlp.vim'
Plug 'tpope/vim-sensible'
Plug 'machakann/vim-highlightedyank'

" Let this stay at the end!
Plug 'sheerun/vim-polyglot'

call plug#end()

filetype plugin indent on
filetype plugin on

set completeopt=longest,menuone
set mouse=
set cursorcolumn
set scrolloff=3
set showmatch
set updatetime=1000
set nobackup
set noswapfile
set tabstop=2
set softtabstop=2
set shiftwidth=2
set wildignore+=*/tmp,*.so,*.swp,*.zip
set shiftround
set smartindent
set expandtab
set hlsearch
set ignorecase
set smartcase
set incsearch
set number
set relativenumber
set noshowmode
set textwidth=80
set wrapmargin=2
set colorcolumn=80

syntax on

set breakindent
set backspace=indent,eol,start
set history=200
set wildmenu
set wildmode=list,full
set hidden
set splitright
set splitbelow
set foldmethod=indent
set foldlevel=99
set foldignore=
set laststatus=2
set noerrorbells
set novisualbell
set belloff=all

inoremap jk <esc>

vnoremap < <gv
vnoremap > >gv

nnoremap <C-h> <C-w>h
nnoremap <C-j> <C-w>j
nnoremap <C-k> <C-w>k
nnoremap <C-l> <C-w>l

vnoremap \ zf

au VimEnter * RainbowParenthesesToggle
au Syntax * RainbowParenthesesLoadRound
au Syntax * RainbowParenthesesLoadSquare
au Syntax * RainbowParenthesesLoadBraces

let g:user_emmet_leader_key='<C-e>'

if has('conceal')
	set conceallevel=2 concealcursor=niv
endif

set background=dark
colorscheme gruvbox

set termguicolors

let g:airline_powerline_fonts = 0
let g:airline_theme = 'gruvbox'
let &t_SI = "\<esc>[5 q"
let &t_SR = "\<esc>[5 q"
let &t_EI = "\<esc>[2 q"
packloadall

silent! helptags ALL
