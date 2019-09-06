export interface FbResponseObject {
  data: Data[];
  paging: Paging;
}

interface Paging {
  cursors: Cursors;
  next: string;
}

interface Cursors {
  before: string;
  after: string;
}

interface Data {
  attachments: Attachments;
  message: string;
  id: string;
  created_time: string;
}

interface Attachments {
  data: Attachment[];
}

interface Attachment {
  media: Media;
}

interface Media {
  image: Image;
  source: string;
}

interface Image {
  height: number;
  src: string;
  width: number;
}