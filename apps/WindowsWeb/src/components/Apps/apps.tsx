import { ThemeImage } from '@repo/ui/components'
import Image from 'next/image';

import { Edge } from '@/components/Apps/Edge';
import { Chrome } from '@/components/Apps/Chrome';
import { CMD } from '@/components/Apps/CMD';
import { Calculator } from '@/components/Apps/Calculator';
import { FileExplorer } from '@/components/Apps/FileExplorer';
import { Github } from '@/components/Apps/Github';
import { Notepad } from '@/components/Apps/Notepad';
import { PowerShell } from '@/components/Apps/PowerShell';
import { RecycleBin } from '@/components/Apps/RecycleBin';
import { Settings } from '@/components/Apps/Settings';
import { Spotify } from '@/components/Apps/Spotify';
import { Terminal } from '@/components/Apps/Terminal';
import { VSCode } from '@/components/Apps/VSCode';
import CalculatorIcon from '@/public/icons/Calculator.png';
import ChatIcon from '@/public/icons/Chat.png';
import EdgeIcon from '@/public/icons/Edge.png';
import ChromeIcon from '@/public/icons/Chrome.svg';
import FileExplorerIcon from '@/public/icons/FileExplorer.png';
import GithubIcon from '@/public/icons/Github.svg';
import InstagramIcon from '@/public/icons/Instagram.svg';
import MailIcon from '@/public/icons/Mail.png';
import OfficeIcon from '@/public/icons/Office365.png';
import NotepadIcon from '@/public/icons/Notepad.svg';
import PhotosIcon from '@/public/icons/Photos.png';
import SettingsIcon from '@/public/icons/Settings.png';
import SolitaireIcon from '@/public/icons/Solitaire.svg';
import SpotifyIcon from '@/public/icons/Spotify.svg';
import StoreDarkIcon from '@/public/icons/Store_Dark.png';
import StoreIconLight from '@/public/icons/Store_Light.png';
import RecycleBinIcon from '@/public/icons/icons8-bin-windows.svg';
import TasksIconDark from '@/public/icons/TaskView_Dark.png';
import TasksIconLight from '@/public/icons/TaskView_Light.png';
import TerminalIcon from '@/public/icons/Terminal.svg';
import VSCodeIcon from '@/public/icons/VSCode.svg';
import WhiteboardIcon from '@/public/icons/Whiteboard.svg';
import WordIcon from '@/public/icons/Word.svg';
import XboxIcon from '@/public/icons/Xbox.svg';

export const TasksApp: App = {
	shortName: 'Tasks',
	fullName: 'Tasks',
	processName: 'tasks',
	icon: (
		<ThemeImage
			alt="tasks"
			srcDark={TasksIconDark}
			srcLight={TasksIconLight}
		/>
	),
	Window: null,
};

export const ChatApp: App = {
	shortName: 'Chat',
	fullName: 'Microsoft Teams',
	processName: 'chat',
	icon: <Image alt="chat" src={ChatIcon} />,
	Window: null,
};

export const EdgeApp: App = {
	shortName: 'Edge',
	fullName: 'Microsoft Edge',
	processName: 'edge',
	icon: (
		<Image
			alt="edge"
			quality={100}
			src={EdgeIcon}
			style={{
				// eslint-disable-next-line no-inline-styles/no-inline-styles -- Icon is too small in some cases
				minWidth: '28px',
			}}
		/>
	),
	Window: Edge,
	initialSize: {
		width: 1024,
		height: 768,
	},
};

export const FileExplorerApp: App = {
	shortName: 'File Explorer',
	fullName: 'File Explorer',
	processName: 'fileExplorer',
	icon: <Image alt="file-explorer" src={FileExplorerIcon} />,
	Window: FileExplorer,
	initialSize: {
		width: 900,
		height: 600,
	},
};

export const StoreApp: App = {
	shortName: 'Store',
	fullName: 'Microsoft Store',
	processName: 'store',
	icon: (
		<ThemeImage
			alt="store"
			srcDark={StoreDarkIcon}
			srcLight={StoreIconLight}
		/>
	),
	Window: null,
};
export const OfficeApp: App = {
	shortName: 'Office',
	fullName: 'Microsoft 365 (Office)',
	processName: 'office',
	icon: <Image alt="office" src={OfficeIcon} />,
	Window: null,
};

export const MailApp: App = {
	shortName: 'Mail',
	fullName: 'Mail',
	processName: 'mail',
	icon: <Image alt="mail" src={MailIcon} />,
	Window: null,
};

export const PhotosApp: App = {
	shortName: 'Photos',
	fullName: 'Photos',
	processName: 'photos',
	icon: <Image alt="photos" src={PhotosIcon} />,
	Window: null,
};

export const SettingsApp: App = {
	shortName: 'Settings',
	fullName: 'Settings',
	processName: 'settings',
	icon: (
		<Image
			alt="settings"
			src={SettingsIcon}
			style={{
				// eslint-disable-next-line no-inline-styles/no-inline-styles -- Icon is too small in some cases
				minWidth: '28px',
			}}
		/>
	),
	Window: Settings,
	initialSize: {
		width: 1100,
		height: 750,
	},
	minSize: {
		width: 900,
		height: 600,
	},
};

export const XboxApp: App = {
	shortName: 'Xbox',
	fullName: 'Xbox',
	processName: 'xbox',
	icon: <Image alt="xbox" src={XboxIcon } />,
	Window: null,
};

export const SolitaireApp: App = {
	shortName: 'Solitaire',
	fullName: 'Solitaire',
	processName: 'solitaire',
	icon: (
		<Image alt="solitaire" src={SolitaireIcon } />
	),
	Window: null,
};

export const SpotifyApp: App = {
	shortName: 'Spotify',
	fullName: 'Spotify',
	processName: 'spotify',
	icon: (
		<Image
			alt="spotify"
			quality={100}
			src={SpotifyIcon }
		/>
	),
	Window: Spotify,
};

export const InstagramApp: App = {
	shortName: 'Instagram',
	fullName: 'Instagram',
	processName: 'instagram',
	icon: (
		<Image alt="instagram" src={InstagramIcon } />
	),
	Window: null,
};

export const CalculatorApp: App = {
	shortName: 'Calculator',
	fullName: 'Calculator',
	processName: 'calculator',
	icon: <Image alt="calculator" src={CalculatorIcon} />,
	Window: Calculator,
	initialSize: {
		width: 320,
		height: 480,
	},
};

export const NotepadApp: App = {
	shortName: 'Notepad',
	fullName: 'Notepad',
	processName: 'notepad',
	icon: (
		<Image
			alt="notepad"
			quality={100}
			src={NotepadIcon}
			style={{
				minWidth: '28px',
			}}
		/>
	),
	Window: Notepad,
	initialSize: {
		width: 700,
		height: 500,
	},
};

export const TerminalApp: App = {
	shortName: 'Terminal',
	fullName: 'Windows Terminal',
	processName: 'terminal',
	icon: <Image alt="terminal" src={TerminalIcon} />,
	Window: Terminal,
};

export const VSCodeApp: App = {
	shortName: 'VSCode',
	fullName: 'Visual Studio Code',
	processName: 'vscode',
	icon: (
		<Image
			alt="vscode"
			quality={100}
			src={VSCodeIcon }
		/>
	),
	Window: VSCode,
	initialSize: {
		width: 1024,
		height: 768,
	},
};

export const WhiteboardApp: App = {
	shortName: 'Whiteboard',
	fullName: 'Whiteboard',
	processName: 'whiteboard',
	icon: (
		<Image alt="whiteboard" src={WhiteboardIcon } />
	),
	Window: null,
};

export const WordApp: App = {
	shortName: 'Word',
	fullName: 'Word',
	processName: 'word',
	icon: <Image alt="word" src={WordIcon} />,
	Window: null,
};

export const ExcelApp: App = {
	shortName: 'Excel',
	fullName: 'Excel',
	processName: 'excel',
	icon: <Image alt="excel" src={OfficeIcon} />,
	Window: null,
};

export const PowerPointApp: App = {
	shortName: 'PowerPoint',
	fullName: 'PowerPoint',
	processName: 'powerpoint',
	icon: <Image alt="powerpoint" src={OfficeIcon} />,
	Window: null,
};

export const OutlookApp: App = {
	shortName: 'Outlook',
	fullName: 'Outlook',
	processName: 'outlook',
	icon: <Image alt="outlook" src={OfficeIcon} />,
	Window: null,
};

export const OneNoteApp: App = {
	shortName: 'OneNote',
	fullName: 'OneNote',
	processName: 'onenote',
	icon: <Image alt="onenote" src={OfficeIcon} />,
	Window: null,
};

export const GithubApp: App = {
	shortName: 'Github',
	fullName: 'Github',
	processName: 'github',
	icon: (
		<Image
			alt="github"
			quality={100}
			src={GithubIcon }
		/>
	),
	Window: Github,
};

export const ChromeApp: App = {
	shortName: 'Chrome',
	fullName: 'Google Chrome',
	processName: 'chrome',
	icon: (
		<Image
			alt="chrome"
			quality={100}
			src={ChromeIcon}
			style={{
				minWidth: '28px',
			}}
		/>
	),
	Window: Chrome,
	initialSize: {
		width: 1024,
		height: 768,
	},
};

export const PowerShellApp: App = {
	shortName: 'PowerShell',
	fullName: 'Windows PowerShell',
	processName: 'powershell',
	icon: <Image alt="powershell" src={TerminalIcon} />,
	Window: PowerShell,
	initialSize: {
		width: 800,
		height: 600,
	},
};

export const CMDApp: App = {
	shortName: 'CMD',
	fullName: 'Command Prompt',
	processName: 'cmd',
	icon: <Image alt="cmd" src={TerminalIcon} />,
	Window: CMD,
	initialSize: {
		width: 800,
		height: 600,
	},
};

export const RecycleBinApp: App = {
	shortName: 'Recycle Bin',
	fullName: 'Recycle Bin',
	processName: 'recycleBin',
	icon: (
		<Image
			alt="recycle-bin"
			quality={100}
			src={RecycleBinIcon}
			style={{
				minWidth: '28px',
			}}
		/>
	),
	Window: RecycleBin,
	initialSize: {
		width: 800,
		height: 500,
	},
};

export const apps = {
	terminal: TerminalApp,
	github: GithubApp,
	edge: EdgeApp,
	office: OfficeApp,
	mail: MailApp,
	store: StoreApp,
	photos: PhotosApp,
	vscode: VSCodeApp,
	settings: SettingsApp,
	xbox: XboxApp,
	solitaire: SolitaireApp,
	spotify: SpotifyApp,
	instagram: InstagramApp,
	fileExplorer: FileExplorerApp,
	chat: ChatApp,
	whiteboard: WhiteboardApp,
	word: WordApp,
	excel: ExcelApp,
	powerpoint: PowerPointApp,
	outlook: OutlookApp,
	onenote: OneNoteApp,
	tasks: TasksApp,
	calculator: CalculatorApp,
	notepad: NotepadApp,
	powershell: PowerShellApp,
	cmd: CMDApp,
	chrome: ChromeApp,
	recycleBin: RecycleBinApp,
};

export type Process = keyof typeof apps;
