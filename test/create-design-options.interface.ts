import { Client } from '../src/clients/client.entity';
import { TemplateColor } from '../src/template/color/template-color.entity';
import { Size } from '../src/template/size/size.entity';
import { Template } from '../src/template/template.entity';
import { User } from '../src/user/user.entity';

export interface ICreateDesignOptions {
  name?: string;
  user?: User;
  color?: TemplateColor;
  client?: Client;
  size?: Size;
  template?: Template;
}
