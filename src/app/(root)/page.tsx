'use client';

import {Stock} from '@/app/(root)/components/Stock';
import {Table} from 'akeneo-design-system';
import Image from 'next/image';
import {useState} from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 10px;
`;

export default function Home() {
  const [value, setValue] = useState(0);
  return (
    <Container>
      <Table>
        <Table.Header>
          <Table.HeaderCell>Illustration</Table.HeaderCell>
          <Table.HeaderCell>Name</Table.HeaderCell>
          <Table.HeaderCell>Format</Table.HeaderCell>
          <Table.HeaderCell>Stock</Table.HeaderCell>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>
              <Image
                src="https://scontent.cdninstagram.com/v/t51.2885-15/427172601_392548660150973_4785277053165070796_n.jpg?stp=dst-jpg_e35&efg=eyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi4xNDQweDE0Mzkuc2RyIn0&_nc_ht=scontent.cdninstagram.com&_nc_cat=105&_nc_ohc=ITX5LORhlfkAX_awrz4&edm=APs17CUBAAAA&ccb=7-5&ig_cache_key=MzMwMTk5MzY0MjI1NTAxNTQ2NQ%3D%3D.2-ccb7-5&oh=00_AfA-Ph98Fl_xGvJ0C6apwhJWCdPdhb7W3YeWnvIvjAXiuQ&oe=65D0B718&_nc_sid=10d13b"
                alt="Illustration image"
                width={100}
                height={100}
              />
            </Table.Cell>
            <Table.Cell>Des fleurs</Table.Cell>
            <Table.Cell>A4</Table.Cell>
            <Table.Cell>
              <Stock value={value} onChange={setValue} />
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>
              <Image
                src="https://scontent.cdninstagram.com/v/t51.2885-15/427172601_392548660150973_4785277053165070796_n.jpg?stp=dst-jpg_e35&efg=eyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi4xNDQweDE0Mzkuc2RyIn0&_nc_ht=scontent.cdninstagram.com&_nc_cat=105&_nc_ohc=ITX5LORhlfkAX_awrz4&edm=APs17CUBAAAA&ccb=7-5&ig_cache_key=MzMwMTk5MzY0MjI1NTAxNTQ2NQ%3D%3D.2-ccb7-5&oh=00_AfA-Ph98Fl_xGvJ0C6apwhJWCdPdhb7W3YeWnvIvjAXiuQ&oe=65D0B718&_nc_sid=10d13b"
                alt="Illustration image"
                width={100}
                height={100}
              />
            </Table.Cell>
            <Table.Cell>Des fleurs</Table.Cell>
            <Table.Cell>A4</Table.Cell>
            <Table.Cell>
              <Stock value={12} onChange={() => {}} />
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>
              <Image
                src="https://scontent.cdninstagram.com/v/t51.2885-15/427172601_392548660150973_4785277053165070796_n.jpg?stp=dst-jpg_e35&efg=eyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi4xNDQweDE0Mzkuc2RyIn0&_nc_ht=scontent.cdninstagram.com&_nc_cat=105&_nc_ohc=ITX5LORhlfkAX_awrz4&edm=APs17CUBAAAA&ccb=7-5&ig_cache_key=MzMwMTk5MzY0MjI1NTAxNTQ2NQ%3D%3D.2-ccb7-5&oh=00_AfA-Ph98Fl_xGvJ0C6apwhJWCdPdhb7W3YeWnvIvjAXiuQ&oe=65D0B718&_nc_sid=10d13b"
                alt="Illustration image"
                width={100}
                height={100}
              />
            </Table.Cell>
            <Table.Cell>Des fleurs</Table.Cell>
            <Table.Cell>A4</Table.Cell>
            <Table.Cell>
              <Stock value={12} onChange={() => {}} />
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>
              <Image
                src="https://scontent.cdninstagram.com/v/t51.2885-15/427172601_392548660150973_4785277053165070796_n.jpg?stp=dst-jpg_e35&efg=eyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi4xNDQweDE0Mzkuc2RyIn0&_nc_ht=scontent.cdninstagram.com&_nc_cat=105&_nc_ohc=ITX5LORhlfkAX_awrz4&edm=APs17CUBAAAA&ccb=7-5&ig_cache_key=MzMwMTk5MzY0MjI1NTAxNTQ2NQ%3D%3D.2-ccb7-5&oh=00_AfA-Ph98Fl_xGvJ0C6apwhJWCdPdhb7W3YeWnvIvjAXiuQ&oe=65D0B718&_nc_sid=10d13b"
                alt="Illustration image"
                width={100}
                height={100}
              />
            </Table.Cell>
            <Table.Cell>Des fleurs</Table.Cell>
            <Table.Cell>A4</Table.Cell>
            <Table.Cell>
              <Stock value={12} onChange={() => {}} />
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </Container>
  );
}
