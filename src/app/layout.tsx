import type {Metadata} from 'next';
import {Inter} from 'next/font/google';
import './globals.css';
import {Bar} from '../components/default/Bar';
import ThemeClient from './theme';
import {Grid} from '@mui/material';
import {Toaster} from 'react-hot-toast';

const inter = Inter({subsets: ['latin']});

export const metadata: Metadata = {
	title: 'Learn English',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ptBR">
			<body className={inter.className}>
				<ThemeClient>
					<Bar />
					<div
						style={{
							width: '100%',
							display: 'flex',
							justifyContent: 'center',
						}}>
						<div
							style={{
								width: '100%',
								maxWidth: '1100px',
							}}>
							<Grid container className="mt-5" spacing={3}>
								{children}
							</Grid>
						</div>
					</div>
				</ThemeClient>
				<Toaster position="bottom-left" reverseOrder={false} />
			</body>
		</html>
	);
}
