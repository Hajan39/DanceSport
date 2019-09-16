import {
    ContentItem,
    Elements,
    TypeResolver,
    DeliveryClient
} from 'kentico-cloud-delivery';

export class Post extends ContentItem {
    public nadpis?: Elements.TextElement;
    public obrazek?: Elements.AssetsElement;
    public popis?: Elements.TextElement;
}

export class About extends ContentItem {
    public header?: Elements.TextElement;
    public description?: Elements.AssetsElement;
}

export class Prispevatel extends ContentItem {
    public name?: Elements.TextElement;
    public image?: Elements.AssetsElement;
    public web?: Elements.TextElement;
}

export const deliveryClient = new DeliveryClient({
    projectId: '6c32ba4d-beaa-00cd-fc3f-1a61cebf77ce',
    typeResolvers: [
        new TypeResolver('post', () => new Post()),
        new TypeResolver('about', () => new About()),
        new TypeResolver('prispevatele', () => new Prispevatel()),
    ]
});

