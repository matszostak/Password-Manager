import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import '@mantine/core/styles.layer.css';
import 'mantine-datatable/styles.layer.css';
import '@mantine/core/styles.css';
import '@mantine/core/styles/global.css';
import '@mantine/notifications/styles.css';
import 'mantine-datatable/styles.layer.css';
import { MantineProvider, createTheme } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { BrowserRouter } from 'react-router-dom';
import { Notifications } from '@mantine/notifications';

const root = ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement
);

const theme = createTheme({
	fontFamily: 'Open Sans, sans-serif',
	primaryColor: 'indigo',
});
localStorage.setItem('isDbOpened', 'false')
localStorage.setItem('dbContent', 'eyJ2YXVsdE5hbWUiOiAiIiwiY3JlYXRpb25kYXRlIjogIiIsInZhdWx0IjogW119')
localStorage.setItem('kdfAlgo', 'true')
root.render(
	<MantineProvider defaultColorScheme='dark' theme={theme}>
		<ModalsProvider>
			<BrowserRouter>
				<Notifications />
				<App />
			</BrowserRouter>
		</ModalsProvider>
	</MantineProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
