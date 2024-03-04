import {NextApiRequest, NextApiResponse} from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const {url} = req.query;
  const response = await fetch(`${url}?__a=1&__d=dis` as string, {
    headers: {},
  });
  const data = await response.json();
  console.log(data);

  res.status(200).json({url: data.graphql.shortcode_media.display_url});
};

export default handler;
